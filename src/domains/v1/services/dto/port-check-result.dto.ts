import { ApiProperty } from '@nestjs/swagger';

export class PortCheckResultDto {
  @ApiProperty({ example: '192.168.1.1', description: 'Проверяемый IP' })
  ip: string;

  @ApiProperty({ example: 8080, description: 'Проверяемый порт' })
  port: number;

  @ApiProperty({
    example: 'open',
    description: 'Статус порта (open/closed)',
    enum: ['open', 'closed'],
  })
  status: string;

  @ApiProperty({
    example: 120,
    description: 'Время ответа в миллисекундах',
  })
  responseTime: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Время проверки',
  })
  timestamp: string;
}
