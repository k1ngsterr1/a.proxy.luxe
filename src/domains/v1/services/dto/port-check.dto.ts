import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsInt, Min, Max } from 'class-validator';

export class PortCheckDto {
  @ApiProperty({ example: '192.168.1.1', description: 'IP адрес для проверки' })
  @IsIP()
  ip: string;

  @ApiProperty({ example: 8080, description: 'Порт для проверки (1-65535)' })
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;
}
