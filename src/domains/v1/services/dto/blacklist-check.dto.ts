import { ApiProperty } from '@nestjs/swagger';
import { IsIP } from 'class-validator';

export class BlacklistCheckDto {
  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP адрес для проверки',
  })
  @IsIP()
  ip: string;
}
