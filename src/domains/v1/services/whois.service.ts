import { Injectable } from '@nestjs/common';
// @ts-ignore
import * as whois from 'whois-json';
import { WhoisResponseDto } from './dto/whois-response.dto';

@Injectable()
export class WhoisService {
  async lookup(query: string): Promise<WhoisResponseDto> {
    const rawData = await whois(query, { follow: 3 });
    return this.parseWhoisResponse(query, rawData);
  }

  private parseWhoisResponse(query: string, data: any): WhoisResponseDto {
    return {
      domain: query,
      status: data.domainStatus || 'unknown',
      created: data.creationDate || data.created,
      expires: data.expiryDate || data.expires,
      registrar: data.registrar || data.registrarName,
      nameservers: data.nameServer || [],
      registrant: this.parseRegistrant(data),
      range: data.range || data.CIDR,
      registry: data.registry || data.whoisServer,
      networkName: data.networkName || data.descr,
      organization: data.organization || data.orgName,
      lastUpdated: data.updatedDate || new Date().toISOString(),
      rawDataLink:
        data.referralURL || `https://whois.arin.net/rest/ip/${query}`,
    };
  }

  private parseRegistrant(data: any): object {
    return {
      name: data.registrant?.name || 'REDACTED',
      organization: data.registrant?.organization,
      street: data.registrant?.street,
      city: data.registrant?.city,
      state: data.registrant?.state,
      country: data.registrant?.country,
    };
  }
}
