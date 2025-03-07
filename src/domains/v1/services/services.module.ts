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

@Module({
  providers: [IpService, PortCheckerService, AnonymityCheckerService, WhoisService, BlacklistCheckerService],
  controllers: [IpController, PortCheckerController, AnonymityCheckerController, WhoisController, BlacklistCheckerController]
})
export class ServicesModule {}
