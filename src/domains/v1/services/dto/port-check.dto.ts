import { IsIP, IsInt, Min, Max } from 'class-validator';

export class PortCheckDto {
  @IsIP()
  ip: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;
}
