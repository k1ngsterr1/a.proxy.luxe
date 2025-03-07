import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import { IpInfoDto } from './dto/ip-info.dto';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class IpService {
  async getIpInfo(req: Request): Promise<IpInfoDto> {
    const ip = this.getClientIp(req);
    const geoData = await this.getGeoData(ip);

    return {
      ip,
      country: `${geoData.country_name} (${geoData.country_code})`,
      city: geoData.city,
      postalCode: geoData.postal,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      time: this.formatTime(geoData.time_zone),
      headers: this.parseHeaders(req.headers),
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
    const date = new Date();
    return (
      new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: timezone,
      }).format(date) + ` (${timezone})`
    );
  }

  private parseHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    const allowedHeaders = [
      'x-forwarded-for',
      'user-agent',
      'accept',
      'accept-encoding',
      'accept-language',
      'cookie',
      'referer',
    ];

    return Object.fromEntries(
      Object.entries(headers)
        .filter(([key]) => allowedHeaders.includes(key.toLowerCase()))
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : (value ?? ''),
        ]),
    ) as Record<string, string>;
  }
}
