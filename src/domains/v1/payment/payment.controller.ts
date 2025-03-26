import {
  Controller,
  Post,
  Query,
  Body,
  Response,
  Request,
  ParseFloatPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import * as crypto from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvoicePayeer } from './dto/create-invoice-payeer.dto';

@Controller('v1/payment')
export class PaymentController {
  private readonly secretKey: string;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    const secret_key = this.configService.get<string>('WEBMONEY_SECRET_KEY');

    if (!secret_key) {
      throw new Error('Missing WEBMONEY_SECRET_KEY in config');
    }

    this.secretKey = secret_key;
  }

  @Post('success')
  async successfulPayment(
    @Query('userId') userId: string,
    @Query('amount', ParseFloatPipe) amount: number,
    @Body() body,
    @Request() req,
    @Response() res,
  ) {
    console.log('🔹 Received payment request', { userId, amount, body });

    if (!body || Object.keys(body).length === 0) {
      console.warn(
        '⚠️ Received empty body, returning success without processing.',
      );
      return res
        .status(200)
        .send({ message: 'Payment received but no data provided.' });
    }
    const {
      LMI_PAYEE_PURSE,
      LMI_PAYMENT_AMOUNT,
      LMI_PAYMENT_NO,
      LMI_SYS_INVS_NO,
      LMI_SYS_TRANS_NO,
      LMI_SYS_TRANS_DATE,
      LMI_PAYER_PURSE,
      LMI_PAYER_WM,
      LMI_MODE,
      LMI_HASH,
      LMI_HASH2,
    } = body;

    if (
      !LMI_PAYEE_PURSE ||
      !LMI_PAYMENT_AMOUNT ||
      !LMI_PAYMENT_NO ||
      !LMI_HASH
    ) {
      return res.status(400).send({ message: 'Invalid payment data' });
    }

    const signString = `${LMI_PAYEE_PURSE};${LMI_PAYMENT_AMOUNT};${LMI_PAYMENT_NO};${LMI_MODE};${LMI_SYS_INVS_NO};${LMI_SYS_TRANS_NO};${LMI_SYS_TRANS_DATE};${this.secretKey};${LMI_PAYER_PURSE};${LMI_PAYER_WM}`;
    const expectedHash = crypto
      .createHash('sha256')
      .update(signString, 'utf8')
      .digest('hex')
      .toUpperCase();

    if (expectedHash !== LMI_HASH2) {
      console.error('❌ Invalid WebMoney Signature! Possible fraud attempt.');
      return res.status(400).send({ message: 'Invalid signature' });
    }

    if (!userId || !amount) {
      return res.status(400).send({ message: 'Invalid payment data' });
    }
    await this.paymentService.successfulPayment(userId, amount);

    return res
      .status(200)
      .send({ message: 'Payment successful', userId, amount });
  }

  @Post('payeer/invoice')
  @UseGuards(AuthGuard('jwt'))
  async createInvoicePayeer(
    @Body() data: CreateInvoicePayeer,
    @Request() request,
  ) {
    data.orderId = `${request.user.id}:${Date.now()}:${Math.floor(Math.random() * 1000)}`;
    return this.paymentService.createInvoicePayeer(data);
  }

  @Post('payeer/success')
  async payeerSuccessfulPayment(@Request() request) {
    console.log(request.body);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getPaymentHistory(@Request() request) {
    return await this.paymentService.getPaymentHistory(request.user.id);
  }
}
