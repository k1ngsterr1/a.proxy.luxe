export interface CalcResponse {
  status: 'success' | 'error';
  data: {
    warning: string;
    balance: number;
    total: number;
    quantity: number;
    currency: string;
    discount: number;
    price: number;
  };
  errors: CalcError[];
}

export interface CalcError {
  message: string;
  code: number;
  customData: null;
}
