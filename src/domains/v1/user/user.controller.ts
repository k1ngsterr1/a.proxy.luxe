import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() request) {
    const user = request.user as User;

    return {
      email: user.email,
      balance: user.balance,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('send-verification')
  @UseGuards(AuthGuard('jwt'))
  async sendVerificationEmail(@Request() request) {
    return this.userService.sendVerificationEmail(request.user.email);
  }

  @Post('verify')
  async verifyCode(@Body() data: { code: string; email: string }) {
    return this.userService.setVerify(data.email, data.code);
  }
}
