import { HttpException, Injectable } from '@nestjs/common';
// @ts-ignore
import * as whois from 'whois-json';
import { WhoisResponseDto } from './dto/whois-response.dto';

@Injectable()
export class WhoisService {
  constructor() {}

  async lookup(query: string): Promise<WhoisResponseDto> {
    if (!(await this.isValid(query))) {
      throw new HttpException(
        'Invalid query. Must be a valid domain or IP address.',
        400,
      );
    }
    const rawWhoisData = await whois(query, { follow: 3 });

    return this.parseResponse(query, rawWhoisData);
  }
  async isValid(query: string): Promise<boolean> {
    // Regular expressions for domain names and IP addresses
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
    const ipv6Regex =
      /^([a-fA-F0-9]{1,4}:){7,7}[a-fA-F0-9]{1,4}|([a-fA-F0-9]{1,4}:){1,7}:|([a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|([a-fA-F0-9]{1,4}:){1,5}(:[a-fA-F0-9]{1,4}){1,2}|([a-fA-F0-9]{1,4}:){1,4}(:[a-fA-F0-9]{1,4}){1,3}|([a-fA-F0-9]{1,4}:){1,3}(:[a-fA-F0-9]{1,4}){1,4}|([a-fA-F0-9]{1,4}:){1,2}(:[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:((:[a-fA-F0-9]{1,4}){1,6})|:((:[a-fA-F0-9]{1,4}){1,7}|:)|fe80:(:[a-fA-F0-9]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])|([a-fA-F0-9]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$/;

    return (
      domainRegex.test(query) || ipv4Regex.test(query) || ipv6Regex.test(query)
    );
  }

  private parseResponse(query: string, whoisData: any): WhoisResponseDto {
    return {
      domain: query,
      host: whoisData.host || 'Unknown',
      geolocationProvider: 'MaxMind IP2Location',
      inetnum: whoisData.inetnum || whoisData.range,
      netname: whoisData.netname,
      descr: whoisData.descr,
      adminC: whoisData.adminC,
      techC: whoisData.techC,
      status: whoisData.status,
      mnt_by: whoisData.mntBy ? [whoisData.mntBy] : [],
      created: whoisData.creationDate,
      lastModified: whoisData.lastUpdateOfWhoisDatabase,
      source: whoisData.source,
      registrar: whoisData.registrar,
      registrarWhoisServer: whoisData.registrarWhoisServer,
      registrarUrl: whoisData.registrarUrl,
      registrarIanaId: whoisData.registrarIanaId,
      registrarAbuseContactEmail: whoisData.registrarAbuseContactEmail,
      registrarAbuseContactPhone: whoisData.registrarAbuseContactPhone,
      domainStatus: whoisData.domainStatus,
      registrantOrganization: whoisData.registrantOrganization,
      registrantStateProvince: whoisData.registrantStateProvince,
      registrantCountry: whoisData.registrantCountry,
      registrantEmail: whoisData.registrantEmail,
      adminOrganization: whoisData.adminOrganization,
      adminStateProvince: whoisData.adminStateProvince,
      adminCountry: whoisData.adminCountry,
      adminEmail: whoisData.adminEmail,
      techOrganization: whoisData.techOrganization,
      techStateProvince: whoisData.techStateProvince,
      techCountry: whoisData.techCountry,
      techEmail: whoisData.techEmail,
      nameServer: whoisData.nameServer,
      dnssec: whoisData.dnssec,
      urlOfTheIcannWhoisDataProblemReportingSystem:
        whoisData.urlOfTheIcannWhoisDataProblemReportingSystem,
      lastUpdateOfWhoisDatabase: whoisData.lastUpdateOfWhoisDatabase,
      notice: whoisData.notice,
      termsOfUse: whoisData.termsOfUse,
      byTheFollowingTermsOfUse: whoisData.byTheFollowingTermsOfUse,
      to: whoisData.to,
      person: {
        name: whoisData.person || 'Unknown',
        address: whoisData.address || 'Unknown',
        phone: whoisData.phone || 'Unknown',
        nicHdl: whoisData.nicHdl || 'Unknown',
      },
      route: {
        route: whoisData.route || 'Unknown',
        origin: whoisData.origin || 'Unknown',
        mnt_by: whoisData.mntBy ? [whoisData.mntBy] : [],
      },
      registrant: this.parseRegistrant(whoisData),
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
