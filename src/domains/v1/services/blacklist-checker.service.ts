import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BlacklistResultDto } from './dto/blacklist-result.dto';

@Injectable()
export class BlacklistCheckerService {
  private readonly blacklistProviders = [
    'zen.spamhaus.org',
    'b.barracudacentral.org',
    'bl.spamcop.net',
    // Добавьте другие списки
  ];

  async checkIp(ip: string): Promise<BlacklistResultDto> {
    const results = await Promise.all(
      this.blacklistProviders.map((provider) =>
        this.checkSingleList(ip, provider),
      ),
    );

    const blacklists = results.filter((result) => result.isListed);

    return {
      ip,
      isListed: blacklists.length > 0,
      blacklists: blacklists.map((b) => b.provider),
      blacklistCount: blacklists.length,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkSingleList(
    ip: string,
    provider: string,
  ): Promise<{ provider: string; isListed: boolean }> {
    try {
      const reversedIp = ip.split('.').reverse().join('.');
      const lookupAddress = `${reversedIp}.${provider}`;

      const response = await axios.get(`http://${lookupAddress}`);
      return {
        provider,
        isListed: response.status === 200,
      };
    } catch (error) {
      return {
        provider,
        isListed: false,
      };
    }
  }
}
