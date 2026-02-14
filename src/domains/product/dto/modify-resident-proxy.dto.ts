import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoDTO {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  isp?: string;
}

export class ModifyResidentProxyDTO {
  @IsString()
  package_key: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  ports: number;

  @IsOptional()
  @IsString()
  whitelist?: string;

  @IsString()
  title: string;

  @IsNumber()
  rotation: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoDTO)
  geo?: GeoDTO;
}
