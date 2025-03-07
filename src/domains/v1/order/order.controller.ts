import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { OrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiResponse({ status: 201, description: 'Заказ создан', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Пользователь/продукт не найден' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заказы' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [OrderDto] })
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
