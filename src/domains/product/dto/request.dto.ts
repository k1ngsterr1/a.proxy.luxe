export interface CalcRequestDTO {
  countryId: number;
  periodId: string;
  quantity: number;
  protocol?: string;
}

export interface CalcResidentRequestDTO {
  tariffId: number;
  quantity: number;
}