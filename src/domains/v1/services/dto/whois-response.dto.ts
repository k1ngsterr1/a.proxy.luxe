import { ApiProperty } from '@nestjs/swagger';

export class WhoisResponseDto {
  @ApiProperty({ example: 'google.com', description: 'Запрашиваемый домен/IP' })
  domain: string;

  @ApiProperty({ example: 'active', description: 'Статус домена' })
  status: string;

  @ApiProperty({
    example: '1997-09-15T00:00:00Z',
    description: 'Дата создания',
  })
  created: string;

  @ApiProperty({
    example: '2028-09-14T00:00:00Z',
    description: 'Дата окончания',
  })
  expires: string;

  @ApiProperty({ example: 'MarkMonitor Inc.', description: 'Регистратор' })
  registrar: string;

  @ApiProperty({
    example: ['ns1.google.com', 'ns2.google.com'],
    description: 'Серверы имен',
  })
  nameservers: string[];

  @ApiProperty({
    example: {
      name: 'REDACTED FOR PRIVACY',
      organization: 'REDACTED FOR PRIVACY',
      street: 'REDACTED FOR PRIVACY',
      city: 'REDACTED FOR PRIVACY',
      state: 'CA',
      country: 'US',
    },
    description: 'Информация о регистранте',
  })
  registrant: object;

  @ApiProperty({ example: '104.16.0.0/12', description: 'IP диапазон' })
  range: string;

  @ApiProperty({ example: 'ARIN', description: 'Региональный реестр' })
  registry: string;

  @ApiProperty({ example: 'GOOGLE', description: 'Название сети' })
  networkName: string;

  @ApiProperty({ example: 'Google LLC', description: 'Организация' })
  organization: string;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Время последнего обновления',
  })
  lastUpdated: string;

  @ApiProperty({
    example: 'Full WHOIS data available at...',
    description: 'Ссылка на полные данные',
  })
  rawDataLink: string;
}
