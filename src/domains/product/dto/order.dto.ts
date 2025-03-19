export interface OrderInfo {
  protocol?: string | undefined;
  countryId?: number | undefined;
  periodId?: string | undefined;
  coupon?: string;
  tarifId?: number | undefined;
  paymentId: number;
  quantity?: number;
  authorization?: string;
  targetId?: number;
  targetSectionId?: number;
  customTargetName?: null | string;
}
