// src/ipv6/ipv6.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Ipv6Service } from './ipv6.service';
import { Ipv6CheckDto, Ipv6ResultDto } from './dto/ipv6-support.dto';

@Controller('v1/services/ipv6')
export class Ipv6Controller {
  constructor(private readonly ipv6Service: Ipv6Service) {}

  @Post('check')
  async check(@Body() dto: Ipv6CheckDto): Promise<Ipv6ResultDto> {
    return this.ipv6Service.checkIPv6(dto.domain);
  }
}
