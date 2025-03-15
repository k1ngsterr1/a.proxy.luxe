import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { Axios } from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly payeer: Axios;
  private readonly account: string;
  private readonly api_id: string;
  private readonly api_pass: string;
  private readonly merchant_id: string;
  private readonly merchant_pass: string;

  constructor(private readonly configService: ConfigService) {
    this.payeer = axios.create({
      baseURL: 'https://payeer.com/ajax/api/api.php',
    });
    this.account = configService.get<string>('PAYEER_ACCOUNT') as string;
    this.api_id = configService.get<string>('PAYEER_API_ID') as string;
    this.api_pass = configService.get<string>(
      'PAYEER_API_SECRET_KEY',
    ) as string;
    this.merchant_id = configService.get<string>(
      'PAYEER_MERCHANT_ID',
    ) as string;
    this.merchant_pass = configService.get<string>(
      'PAYEER_MERCHANT_SECRET_KEY',
    ) as string;
  }

  /**
   * Generate Payeer Payment URL
   */
  async generatePaymentLink(
    orderId: string,
    amount: string,
    currency: string,
  ): Promise<string> {
    const response = await this.payeer.post('', null, {
      params: {
        account: this.account,
        apiId: this.api_id,
        apiPass: this.api_pass,
        m_shop: this.merchant_id,
        action: 'invoiceCreate',
        m_orderid: orderId,
        m_amount: Number(amount),
        m_curr: currency,
        m_desc: 'Test payeer payment',
      },
    });

    return response.data.url;
  }
}
