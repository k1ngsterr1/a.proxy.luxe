import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IpInfoDto } from './dto/ip-info.dto';
import { IpService } from './ip.service';
import { Request } from 'express';

@ApiTags('Services')
@Controller('services/ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Get('my-ip')
  @ApiOperation({ summary: 'Получить информацию о текущем IP и браузере' })
  @ApiOkResponse({ type: IpInfoDto })
  getIpInfo(@Req() req: Request): Promise<IpInfoDto> {
    return this.ipService.getIpInfo(req);
  }
}
