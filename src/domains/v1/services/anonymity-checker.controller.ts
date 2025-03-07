import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnonymityCheckDto } from './dto/anonymity-check.dto';
import { AnonymityCheckerService } from './anonymity-checker.service';
import { Request } from 'express';

@ApiTags('Services')
@Controller('services/anonymity-checker')
export class AnonymityCheckerController {
  constructor(
    private readonly anonymityCheckerService: AnonymityCheckerService,
  ) {}

  @Get('check')
  @ApiOperation({
    summary: 'Проверить уровень анонимности',
    description: 'Проверяет насколько анонимен пользователь в сети',
  })
  @ApiResponse({
    status: 200,
    description: 'Результат проверки анонимности',
    type: AnonymityCheckDto,
  })
  async checkAnonymity(@Req() req: Request): Promise<AnonymityCheckDto> {
    return this.anonymityCheckerService.checkAnonymity(req);
  }
}
