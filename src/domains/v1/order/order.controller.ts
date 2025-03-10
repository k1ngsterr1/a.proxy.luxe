import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { OrderDto } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Orders')
@Controller('v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createOrderDto: CreateOrderDto, @Request() request) {
    createOrderDto.userId = request.user.id;
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оплатить заказ' })
  @ApiBody({ type: PaymentOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Статус оплаты обновлен',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async processPayment(@Body() paymentDto: PaymentOrderDto) {
    return this.orderService.processPayment(paymentDto);
  }
}
