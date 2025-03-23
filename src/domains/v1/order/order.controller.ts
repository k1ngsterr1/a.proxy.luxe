import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FinishOrderDto } from './dto/payment-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() request) {
    createOrderDto.userId = request.user.id;
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Request() request,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.orderService.findAll(request.user.id, pageNumber, limitNumber);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Post('finish')
  @UseGuards(AuthGuard('jwt'))
  async finishOrder(@Body() finishDto: FinishOrderDto) {
    return this.orderService.finishOrder(finishDto);
  }
}
