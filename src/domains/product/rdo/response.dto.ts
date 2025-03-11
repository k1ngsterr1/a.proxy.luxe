import { Country, Period, Target, Tariff } from '../dto/reference.response';
interface Option {
  id: string;
  text: string;
}
export interface ResponseReferenceDTO {
  status: 'success';
  isp: {
    country: Country[];
    period: Period[];
    targets: Target[];
  };
  ipv6: {
    country: Country[];
    period: Period[];
    targets: Target[];
  };
  resident: {
    targets: Target[];
    tariffs: Tariff[];
  };
  amounts: Option[];
}

export interface ResponseReferenceSingleDTO {
  status: 'success';
  country: Country[];
  period: Period[];
  targets: Target[];
  tariffs?: Tariff[];
  amounts?: Option[];
}
export interface ResponseReferenceSignleDTO {
  status: 'success';
  data: {
    country: Option[];
    period: Option[];
    targets: Option[];
  };
  amounts: Option[];
}

export interface ResponseCalcDTO {
  status: 'success';
  totalPrice: number;
  price: number;
}

export interface ResponseErrorDTO {
  status: 'error';
  message: string;
  error?: string;
}
