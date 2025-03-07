import { ApiProperty } from '@nestjs/swagger';

export class BlacklistResultDto {
  @ApiProperty({ example: '192.168.1.1', description: 'Проверяемый IP' })
  ip: string;

  @ApiProperty({
    example: true,
    description: 'Находится ли IP в черном списке',
  })
  isListed: boolean;

  @ApiProperty({
    example: ['spamhaus.org', 'barracudacentral.org'],
    description: 'Списки, в которых найден IP',
  })
  blacklists: string[];

  @ApiProperty({
    example: 2,
    description: 'Количество черных списков, в которых найден IP',
  })
  blacklistCount: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Время проверки',
  })
  timestamp: string;
}
