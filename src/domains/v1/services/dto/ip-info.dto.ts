import { ApiProperty } from '@nestjs/swagger';

export class IpInfoDto {
  @ApiProperty({ example: '98.105.233.123' })
  ip: string;

  @ApiProperty({ example: 'Russia (RU)' })
  country: string;

  @ApiProperty({ example: 'Moscow' })
  city: string;

  @ApiProperty({ example: '460000' })
  postalCode: string;

  @ApiProperty({ example: 51.7898 })
  latitude: number;

  @ApiProperty({ example: 55.0984 })
  longitude: number;

  @ApiProperty({ example: '04-09-2021, 13:25 (Asia/Yekaterinburg)' })
  time: string;

  @ApiProperty({
    example: {
      'X-Forwarded-For': '98.135.127.123, 185.26.97.85',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
      // ... другие заголовки
    },
  })
  headers: Record<string, string>;
}
