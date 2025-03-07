import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WhoisService } from './whois.service';
import { WhoisRequestDto } from './dto/whois-request.dto';
import { WhoisResponseDto } from './dto/whois-response.dto';

@ApiTags('Services')
@Controller('services/whois')
export class WhoisController {
  constructor(private readonly whoisService: WhoisService) {}

  @Post('lookup')
  @ApiOperation({
    summary: 'WHOIS-поиск информации',
    description: 'Получение информации о домене или IP-адресе',
  })
  @ApiResponse({
    status: 200,
    description: 'Результаты WHOIS-запроса',
    type: WhoisResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректный запрос' })
  async lookup(@Body() dto: WhoisRequestDto): Promise<WhoisResponseDto> {
    return this.whoisService.lookup(dto.query);
  }
}
