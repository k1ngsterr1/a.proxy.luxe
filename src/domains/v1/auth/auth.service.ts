import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../shared/prisma.service';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

interface JwtPayload {
  sub: string;
  email: string;
}

interface JwtRefreshTokenPayload {
  sub: string;
  refreshTokenId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, ...userDetails } = registerDto;
    const user = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (user) {
      throw new HttpException('User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const current_user = await this.prisma.user.create({
      data: {
        ...userDetails,
        password: hashedPassword,
      },
    });

    await this.userService.sendVerificationEmail(registerDto.email);

    return current_user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '1d',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const refreshTokenId = randomUUID();
    const payload: JwtRefreshTokenPayload = {
      sub: user.id,
      refreshTokenId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtRefreshTokenPayload =
      await this.jwtService.verifyAsync<JwtRefreshTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

    const { sub } = payload;
    const user = await this.prisma.user.findUnique({ where: { id: sub } });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
