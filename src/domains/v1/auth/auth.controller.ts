import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordEmailDto } from './dto/reset-email.dto';
import { request } from 'http';
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Request() request: any) {
    return this.authService.register(registerDto, request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('reset-password-email')
  async resetPasswordEmail(
    @Body() resetPasswordEmailDto: ResetPasswordEmailDto,
    @Request() request,
  ) {
    const lang =
      request.headers['accept-language']
        ?.split(',')[0]
        ?.split('-')[0]
        ?.toLowerCase() || 'en';
    return this.authService.sendResetPassword(resetPasswordEmailDto, lang);
  }
}
