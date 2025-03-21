import { Injectable } from '@nestjs/common';
import * as DNS from 'dns2';
import { BlacklistResultDto } from './dto/blacklist-result.dto';

@Injectable()
export class BlacklistCheckerService {
  private readonly blacklistProviders = [
    'zen.spamhaus.org',
    'b.barracudacentral.org',
    'bl.spamcop.net',
  ];

  private readonly dns = new DNS({ dns: '8.8.8.8' });

  async checkIp(ip: string): Promise<BlacklistResultDto> {
    const results = await Promise.all(
      this.blacklistProviders.map((provider) =>
        this.checkSingleList(ip, provider),
      ),
    );

    const blacklists = results.filter((r) => r.isListed);

    return {
      ip,
      isListed: blacklists.length > 0,
      blacklists: blacklists.map((r) => r.provider),
      blacklistCount: blacklists.length,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkSingleList(
    ip: string,
    provider: string,
  ): Promise<{ provider: string; isListed: boolean }> {
    const query = `${ip.split('.').reverse().join('.')}.${provider}`;

    try {
      const response = await this.dns.resolveA(query);
      console.log(response);
      const isListed = response.answers.some((ans) =>
        ans.address.startsWith('127.'),
      );
      return { provider, isListed };
    } catch (err) {
      return { provider, isListed: false };
    }
  }
}
