export class IpInfoDto {
  ip: string;
  host: string;
  country: string;
  city: string;
  zipcode: string;
  database: string;
  latitude: number;
  longitude: number;
  time: string;
  headers: Record<string, string>;
}
