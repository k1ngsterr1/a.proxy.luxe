export interface CalcRequest {
  protocol?: string;
  countryId: number;
  periodId: string;
  coupon?: string;
  tariffId?: string;
  paymentId: number;
  quantity: number;
  authorization?: string;
  customTargetName?: null | string;
}

export interface CalcResidentRequest {
  coupon: string;
  paymentId: number;
  tarifId: number;
}
