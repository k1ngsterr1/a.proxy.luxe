import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import * as dns from 'dns/promises';
import { AnonymityCheckDto } from './dto/anonymity-check.dto';

@Injectable()
export class AnonymityCheckerService {
  async checkAnonymity(@Req() req: Request): Promise<AnonymityCheckDto> {
    const ip = this.getClientIp(req);
    const geoData = await this.getGeoData(ip);
    const userAgent = req.headers['user-agent'] ?? '';
    const acceptLanguage = req.headers['accept-language'] ?? '';
    const isProxy = geoData.proxy || false;
    const isVpn = geoData.vpn || false;
    const isTor = await this.checkTor(ip);
    const isBlacklisted = await this.checkBlacklist(ip);
    const languageMismatch = this.checkLanguageMismatch(
      geoData.country_code,
      acceptLanguage,
    );

    const anonymityLevel = this.calculateAnonymityLevel(
      isProxy,
      isVpn,
      isTor,
      isBlacklisted,
      languageMismatch,
    );

    return {
      ip,
      country: `${geoData.country_name} (${geoData.country_code})`,
      city: geoData.city,
      postalCode: geoData.postal,
      coordinates: `${geoData.latitude}, ${geoData.longitude}`,
      os: this.detectOs(userAgent),
      browser: this.detectBrowser(userAgent),
      timezone: geoData.time_zone,
      ipTime: this.formatTime(geoData.time_zone),
      systemTime: new Date().toLocaleString(),
      userAgent,
      userAgentMatch: true, // Client-side implementation needed
      browserLanguage: acceptLanguage || 'unknown',
      screenResolution: 'unknown', // Client-side implementation needed
      anonymityLevel,
      isProxy,
      isVpn,
      isTor,
      isAnonymizer: false, // Additional check needed
      isBlacklisted,
      isFlashEnabled: false, // Client-side implementation needed
      isJavaEnabled: false, // Client-side implementation needed
      isActiveXEnabled: false, // Client-side implementation needed
      isWebRtcEnabled: true, // Client-side implementation needed
      webRtcIps: [], // Client-side implementation needed
      checksCount: 10, // Update based on actual checks
      blacklistCount: isBlacklisted ? 1 : 0, // Update based on actual checks
    };
  }

  private getClientIp(req: Request): string {
    return (req.headers['x-forwarded-for']?.toString() || req.ip) ?? 'unknown';
  }

  private async getGeoData(ip: string): Promise<any> {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  }

  private formatTime(timezone: string): string {
    return new Date().toLocaleString('en-US', { timeZone: timezone });
  }

  private detectOs(userAgent: string): string {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac os/i.test(userAgent)) return 'Mac OS';
    if (/linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    return 'Unknown';
  }

  private async checkTor(ip: string): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://check.torproject.org/torbulkexitlist',
      );
      const torExitNodes = response.data
        .split('\n')
        .filter((node) => node.trim() !== '');
      return torExitNodes.includes(ip);
    } catch (error) {
      console.error('Error checking Tor exit nodes:', error);
      return false;
    }
  }

  private async checkBlacklist(ip: string): Promise<boolean> {
    const reversedIp = ip.split('.').reverse().join('.');
    const query = `${reversedIp}.zen.spamhaus.org`;
    try {
      await dns.resolve4(query);
      return true;
    } catch (error) {
      if (error.code === 'ENOTFOUND') return false;
      console.error('DNS lookup error:', error);
      return false;
    }
  }

  private checkLanguageMismatch(
    countryCode: string,
    acceptLanguage: string,
  ): boolean {
    if (!acceptLanguage) return false;
    const expectedLangs = this.getExpectedLanguages(countryCode);
    if (expectedLangs.length === 0) return false;

    const userLangs = acceptLanguage.split(',').map((lang) => {
      const [language] = lang.split(';');
      return language.trim().toLowerCase();
    });

    return !userLangs.some((lang) => expectedLangs.includes(lang));
  }

  private getExpectedLanguages(countryCode: string): string[] {
    const languageMap: { [key: string]: string[] } = {
      US: ['en'],
      GB: ['en'],
      DE: ['de'],
      FR: ['fr'],
      ES: ['es'],
      IT: ['it'],
      JP: ['ja'],
      CN: ['zh'],
      RU: ['ru'],
      BR: ['pt'],
    };
    return languageMap[countryCode ? countryCode.toUpperCase() : '-'] || [];
  }

  private calculateAnonymityLevel(
    isProxy: boolean,
    isVpn: boolean,
    isTor: boolean,
    isBlacklisted: boolean,
    languageMismatch: boolean,
  ): number {
    let level = 0;

    if (isTor) level = 70;
    else if (isVpn) level = 50;
    else if (isProxy) level = 30;

    if (isBlacklisted) level += 20;
    if (languageMismatch) level += 10;

    return Math.min(Math.max(40, level), 100);
  }
}
