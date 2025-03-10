interface Option {
  id: string;
  text: string;
}

export interface ResponseReferenceDTO {
  status: 'success';
  isp: {
    country: Option[];
    period: Option[];
    targets: Option[];
  };
  ipv6: {
    country: Option[];
    period: Option[];
    targets: Option[];
  };
  ipv4: {
    country: Option[];
    period: Option[];
    targets: Option[];
  };
  amounts: Option[];
}

export interface ResponseReferenceSingleDTO {
  status: 'success';
  country: Option[];
  period: Option[];
  targets: Option[];
  amounts: Option[];
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
