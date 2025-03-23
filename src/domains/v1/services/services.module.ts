import { Module } from '@nestjs/common';
import { IpService } from './ip.service';
import { IpController } from './ip.controller';
import { PortCheckerService } from './port-checker.service';
import { PortCheckerController } from './port-checker.controller';
import { AnonymityCheckerService } from './anonymity-checker.service';
import { AnonymityCheckerController } from './anonymity-checker.controller';
import { WhoisService } from './whois.service';
import { WhoisController } from './whois.controller';
import { BlacklistCheckerService } from './blacklist-checker.service';
import { BlacklistCheckerController } from './blacklist-checker.controller';
import { Ipv6Controller } from './ipv6.controller';
import { Ipv6Service } from './ipv6.service';
import { ProxyCheckerController } from './proxy-checker.controller';
import { ProxyCheckerService } from './proxy-checker.service';

@Module({
  providers: [IpService, PortCheckerService, AnonymityCheckerService, WhoisService, BlacklistCheckerService, Ipv6Service, ProxyCheckerService],
  controllers: [IpController, PortCheckerController, AnonymityCheckerController, WhoisController, BlacklistCheckerController, Ipv6Controller, ProxyCheckerController]
})
export class ServicesModule {}
