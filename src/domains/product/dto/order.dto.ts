export interface OrderInfo {
  protocol?: string | undefined;
  countryId?: number | undefined;
  periodId?: string | undefined;
  coupon?: string;
  tariffId?: number | undefined;
  paymentId: number;
  quantity?: number;
  authorization?: string;
  customTargetName?: null | string;
}
