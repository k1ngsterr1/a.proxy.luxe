import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlacklistCheckDto } from './dto/blacklist-check.dto';
import { BlacklistResultDto } from './dto/blacklist-result.dto';
import { BlacklistCheckerService } from './blacklist-checker.service';

@ApiTags('Services')
@Controller('services/blacklist-checker')
export class BlacklistCheckerController {
  constructor(
    private readonly blacklistCheckerService: BlacklistCheckerService,
  ) {}

  @Post('check')
  @ApiOperation({
    summary: 'Проверить IP в черных списках',
    description: 'Проверяет наличие IP в более чем 50 базах данных антиспама',
  })
  @ApiResponse({
    status: 200,
    description: 'Результат проверки',
    type: BlacklistResultDto,
  })
  async checkIp(
    @Body() blacklistCheckDto: BlacklistCheckDto,
  ): Promise<BlacklistResultDto> {
    return this.blacklistCheckerService.checkIp(blacklistCheckDto.ip);
  }
}
