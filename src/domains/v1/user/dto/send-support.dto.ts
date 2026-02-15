import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendSupportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  support: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  captchaToken?: string;
}
