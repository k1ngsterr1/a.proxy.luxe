import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { Axios } from 'axios';

interface MakeOrderDTO {
  countryId: number;
  periodId: string;
  coupon?: string;
  paymentId: number;
  quantity: number;
  authorization: string;
  customTargetName?: string;
  generateAuth: string;
}

@Injectable()
export class BuyService implements OnModuleInit {
  private readonly axios: Axios;

  constructor(private readonly configService: ConfigService) {
    axios.defaults.baseURL = `https://proxy-seller.com/personal/api/v1/${this.configService.get<string>('PROXY_SELLER')}`;
    this.axios = axios;
  }

  async onModuleInit() {
    await this.getReferences('ipv6');
  }

  async getReferences(type: 'isp' | 'ipv6' | 'resident') {
    const response = await this.axios.get(`/reference/list/${type}`);

    if (!response.data?.data?.items) {
      console.warn(`Warning: No items found for type: ${type}`);
      return [];
    }

    console.log(response.data.data.items);
    return response.data;
  }

  async makeOrderISP(
    data: Omit<
      MakeOrderDTO,
      'authorization' | 'generateAuth' | 'customTargetName' | 'paymentId'
    >,
  ) {
    const makeOrder: MakeOrderDTO = {
      countryId: data.countryId,
      periodId: data.periodId,
      coupon: data.coupon,
      paymentId: 1,
      quantity: data.quantity,
      authorization: '',
      generateAuth: '',
    };

    const response = await this.axios.post(`/order/make`, makeOrder);
    console.log(response.data);
  }
}
