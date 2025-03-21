import { IsFQDN } from 'class-validator';

export class Ipv6CheckDto {
  @IsFQDN({}, { message: 'Invalid domain name' })
  domain: string;
}
export class Ipv6ResultDto {
  domain: string;
  hasIpv6: boolean;
  addresses?: string[];
  error?: string;
}
