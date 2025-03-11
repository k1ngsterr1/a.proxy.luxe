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
import { FinishOrderDto } from './dto/payment-order.dto';
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

  @Post('finish')
  @UseGuards(AuthGuard('jwt'))
  async finishOrder(@Body() finishDto: FinishOrderDto) {
    return this.orderService.finishOrder(finishDto);
  }
}
