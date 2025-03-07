import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import { AnonymityCheckDto } from './dto/anonymity-check.dto';

@Injectable()
export class AnonymityCheckerService {
  async checkAnonymity(@Req() req: Request): Promise<AnonymityCheckDto> {
    const ip = this.getClientIp(req);
    const geoData = await this.getGeoData(ip);
    const userAgent = req.headers['user-agent'] ?? ''; // Защита от undefined
    const anonymityLevel = this.calculateAnonymityLevel(req);

    return {
      ip,
      country: `${geoData.country_name} (${geoData.country_code})`,
      city: geoData.city,
      postalCode: geoData.postal,
      coordinates: `${geoData.latitude}, ${geoData.longitude}`,
      os: this.detectOs(userAgent), // Исправлено: userAgent всегда строка
      browser: this.detectBrowser(userAgent), // Исправлено: userAgent всегда строка
      timezone: geoData.timezone,
      ipTime: this.formatTime(geoData.timezone),
      systemTime: new Date().toLocaleString(),
      userAgent, // Исправлено: userAgent всегда строка
      userAgentMatch: true, // Заглушка, требует реализации на клиенте
      browserLanguage: req.headers['accept-language'] ?? 'unknown',
      screenResolution: 'unknown', // Заглушка, требует реализации на клиенте
      anonymityLevel,
      isProxy: this.checkProxy(ip),
      isVpn: this.checkVpn(ip),
      isTor: this.checkTor(ip),
      isAnonymizer: false,
      isBlacklisted: await this.checkBlacklist(ip),
      isFlashEnabled: false,
      isJavaEnabled: false,
      isActiveXEnabled: false,
      isWebRtcEnabled: true,
      webRtcIps: [], // Заглушка, требует реализации на клиенте
      checksCount: 10, // Заглушка
      blacklistCount: 2, // Заглушка
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
    return new Date().toLocaleString('ru-RU', { timeZone: timezone });
  }

  private detectOs(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'Mac OS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private calculateAnonymityLevel(req: Request): number {
    // Логика расчета уровня анонимности
    return 80; // Заглушка
  }

  private checkProxy(ip: string): boolean {
    // Логика проверки прокси
    return false;
  }

  private checkVpn(ip: string): boolean {
    // Логика проверки VPN
    return false;
  }

  private checkTor(ip: string): boolean {
    // Логика проверки Tor
    return false;
  }

  private async checkBlacklist(ip: string): Promise<boolean> {
    // Логика проверки черного списка
    return false;
  }
}
