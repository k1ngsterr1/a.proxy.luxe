import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WhoisService } from './whois.service';
import { WhoisRequestDto } from './dto/whois-request.dto';
import { WhoisResponseDto } from './dto/whois-response.dto';

@ApiTags('Services')
@Controller('v1/services/whois')
export class WhoisController {
  constructor(private readonly whoisService: WhoisService) {}

  @Post('lookup')
  async lookup(@Body() dto: WhoisRequestDto): Promise<WhoisResponseDto> {
    return this.whoisService.lookup(dto.query);
  }
}
