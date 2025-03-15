import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Response,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

@Controller('v1/payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('success')
  async successfulPayment(@Request() req, @Response() res, @Body() body) {
    console.log('current request', req.body);
    console.log(body);
    return res.status(200).send({ message: 'Payment successful' });
  }
}
