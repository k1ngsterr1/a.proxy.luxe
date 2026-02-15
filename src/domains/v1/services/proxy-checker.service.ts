import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class ProxyCheckerService {
  /**
   * Extract IP and port from a string that may contain IPv4 or bracketed IPv6.
   * Returns { ip, port } or null.
   */
  private extractIpPort(str: string): { ip: string; port: string } | null {
    // Try IPv6 in brackets first: [2001:db8::1]:8080
    const ipv6Match = str.match(/\[([0-9a-fA-F:]+)\]:(\d+)/);
    if (ipv6Match) {
      return { ip: ipv6Match[1], port: ipv6Match[2] };
    }
    // Try IPv4: 1.2.3.4:8080
    const ipv4Match = str.match(/(\d+\.\d+\.\d+\.\d+):(\d+)/);
    if (ipv4Match) {
      return { ip: ipv4Match[1], port: ipv4Match[2] };
    }
    return null;
  }

  async checkProxies(proxies: string[], addCountry: boolean): Promise<any[]> {
    return await Promise.all(
      proxies.map(async (raw) => {
        let ip = '';
        let port = '';
        let login = '';
        let password = '';
        let proxyUrl = '';
        let agent: any;
        let proxyType = 'HTTP(s)';

        try {
          if (raw.startsWith('socks5://') || raw.startsWith('socks4://')) {
            // SOCKS proxy: socks5://user:pass@[ipv6]:port or socks5://ip:port
            proxyUrl = raw;
            agent = new SocksProxyAgent(proxyUrl);
            proxyType = raw.startsWith('socks5://') ? 'SOCKS5' : 'SOCKS4';

            const extracted = this.extractIpPort(raw);
            if (extracted) {
              ip = extracted.ip;
              port = extracted.port;
            }
          } else if (raw.includes('[')) {
            // IPv6 format with brackets:
            //   [ipv6]:port
            //   user:pass:[ipv6]:port
            const bracketMatch = raw.match(
              /^(?:([^:@\s]+):([^:@\s]+):)?\[([0-9a-fA-F:]+)\]:(\d+)$/,
            );
            if (!bracketMatch) {
              throw new Error('Invalid IPv6 proxy format');
            }

            login = bracketMatch[1] || '';
            password = bracketMatch[2] || '';
            ip = bracketMatch[3];
            port = bracketMatch[4];

            if (login && password) {
              proxyUrl = `http://${login}:${password}@[${ip}]:${port}`;
            } else {
              proxyUrl = `http://[${ip}]:${port}`;
            }
            agent = new HttpsProxyAgent(proxyUrl);
          } else {
            // IPv4 format: user:pass:ip:port or ip:port
            const parts = raw.split(':');
            if (parts.length === 4) {
              [login, password, ip, port] = parts;
              proxyUrl = `http://${login}:${password}@${ip}:${port}`;
            } else if (parts.length === 2) {
              [ip, port] = parts;
              proxyUrl = `http://${ip}:${port}`;
            } else {
              throw new Error('Invalid proxy format');
            }
            agent = new HttpsProxyAgent(proxyUrl);
          }

          const start = Date.now();
          const response = await axios.get('https://api64.ipify.org', {
            httpsAgent: agent,
            timeout: 10000,
          });
          const end = Date.now();

          return {
            status: 'valid',
            ip,
            port,
            login,
            password,
            type: proxyType,
            responseTime: ((end - start) / 1000).toFixed(3),
            country: addCountry ? await this.getCountry(ip) : undefined,
          };
        } catch (error) {
          return {
            status: 'invalid',
            raw,
            error: error.code || error.message,
          };
        }
      }),
    );
  }

  private async getCountry(ip: string): Promise<string | null> {
    try {
      const res = await axios.get(`http://ip-api.com/json/${ip}`);
      return res.data.countryCode || null;
    } catch (error) {
      return null;
    }
  }
}
