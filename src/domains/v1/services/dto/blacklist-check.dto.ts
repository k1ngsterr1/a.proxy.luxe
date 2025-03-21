import { IsIP } from 'class-validator';

export class BlacklistCheckDto {
  @IsIP()
  ip: string;
}
