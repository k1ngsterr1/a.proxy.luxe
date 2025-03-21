import { Injectable } from '@nestjs/common';
import { Resolver } from 'dns/promises';
import { Ipv6ResultDto } from './dto/ipv6-support.dto';

@Injectable()
export class Ipv6Service {
  async checkIPv6(domain: string): Promise<Ipv6ResultDto> {
    const resolver = new Resolver();

    try {
      const addresses = await resolver.resolve6(domain);
      return {
        domain,
        hasIpv6: addresses.length > 0,
        addresses,
      };
    } catch (err: any) {
      return {
        domain,
        hasIpv6: false,
        error: err.message || 'Unknown error',
      };
    }
  }
}
