import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { PortCheckResultDto } from './dto/port-check-result.dto';

@Injectable()
export class PortCheckerService {
  async checkPort(ip: string, port: number): Promise<PortCheckResultDto> {
    const startTime = Date.now();
    const socket = new Socket();

    return new Promise((resolve) => {
      const timeout = 5000; // 5 секунд таймаут
      let status = 'closed';

      socket.setTimeout(timeout);

      socket.on('connect', () => {
        status = 'open';
        socket.destroy();
      });

      socket.on('timeout', () => {
        socket.destroy();
      });

      socket.on('error', () => {
        socket.destroy();
      });

      socket.on('close', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          ip,
          port,
          status,
          responseTime,
          timestamp: new Date().toISOString(),
        });
      });

      socket.connect(port, ip);
    });
  }
}
