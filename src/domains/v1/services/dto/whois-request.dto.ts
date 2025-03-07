import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WhoisRequestDto {
  @ApiProperty({
    example: 'google.com',
    description: 'Домен, IP-адрес или хост для проверки',
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}
