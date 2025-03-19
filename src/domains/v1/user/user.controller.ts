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
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
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
  async sendVerificationEmail(@Request() request) {
    return this.userService.sendVerificationEmail(request.user.email);
  }

  @Post('verify')
  async verifyCode(@Body() data: { code: string }, @Request() request) {
    return this.userService.setVerify(request.user, data.code);
  }
}
