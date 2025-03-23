import { Body, Controller, Post } from '@nestjs/common';
import { ProxyCheckerService } from './proxy-checker.service';
import { CheckProxyDto } from './dto/proxy-checker.dto';

@Controller('v1/services/proxy-checker')
export class ProxyCheckerController {
  constructor(private readonly proxyCheckerService: ProxyCheckerService) {}

  @Post('check')
  async checkProxies(@Body() dto: CheckProxyDto) {
    return this.proxyCheckerService.checkProxies(dto.proxies, dto.addCountry);
  }
}
