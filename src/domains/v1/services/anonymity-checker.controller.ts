import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnonymityCheckDto } from './dto/anonymity-check.dto';
import { AnonymityCheckerService } from './anonymity-checker.service';
import { Request } from 'express';

@ApiTags('Services')
@Controller('v1/services/anonymity-checker')
export class AnonymityCheckerController {
  constructor(
    private readonly anonymityCheckerService: AnonymityCheckerService,
  ) {}

  @Get('check')
  async checkAnonymity(@Req() req: Request): Promise<AnonymityCheckDto> {
    return this.anonymityCheckerService.checkAnonymity(req);
  }
}
