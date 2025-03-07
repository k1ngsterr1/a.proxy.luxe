import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { PaymentGateway, PaymentStatus, ProxyType } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createOrderDto.user_id },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: createOrderDto.product_id },
    });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const totalPrice =
      Number(product.price) *
      createOrderDto.quantity *
      createOrderDto.period_days;

    return this.prisma.order.create({
      data: {
        userId: createOrderDto.user_id,
        productId: createOrderDto.product_id,
        country: createOrderDto.country,
        quantity: createOrderDto.quantity,
        periodDays: createOrderDto.period_days,
        proxyType: createOrderDto.proxy_type as ProxyType,
        status: PaymentStatus.PENDING,
        totalPrice,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async processPayment(paymentDto: PaymentOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: paymentDto.order_id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Order already processed');
    }

    // Заглушка для интеграции с платежными системами
    const paymentSuccess = this.mockPaymentGateway(paymentDto.gateway);

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: paymentSuccess ? PaymentStatus.PAID : PaymentStatus.CANCELED,
      },
    });
  }

  private mockPaymentGateway(gateway: PaymentGateway): boolean {
    // Реальная интеграция с платежными шлюзами
    console.log(`Processing payment via ${gateway}`);
    return true; // Всегда успешная оплата для примера
  }
}
