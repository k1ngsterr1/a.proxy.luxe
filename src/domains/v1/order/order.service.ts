import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { PaymentGateway, PaymentStatus, ProxyType } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { ProductService } from 'src/domains/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private productService: ProductService,
  ) {}
  //need price check for feature
  async create(createOrderDto: CreateOrderDto) {
    if (
      createOrderDto.type === 'ipv6' &&
      createOrderDto.proxyType === undefined
    ) {
      throw new HttpException('Not specified HTTPS or SOCKS5 for ipv6', 400);
    }
    const reference = await this.productService.getProductReferenceByType(
      createOrderDto.type,
    );

    if (reference.status !== 'success') {
      throw new HttpException(
        reference.message || 'Invalid reference data',
        400,
      );
    }
    if (createOrderDto.type !== 'resident') {
      const isValidCountry = reference.country.some((current) =>
        current.name.endsWith(createOrderDto.country),
      );
      if (!isValidCountry) {
        throw new HttpException('Invalid country', 400);
      }
      const isValidPeriod = reference.period.some((period) =>
        period.id.endsWith(createOrderDto.periodDays),
      );
      if (!isValidPeriod) {
        throw new HttpException('Invalid period', 400);
      }
    } else {
      const isValidTariffs = reference.tariffs?.some(
        (tariff) => tariff.name === createOrderDto.tariff,
      );
      if (!isValidTariffs) {
        throw new HttpException('Invalid tariffs', 400);
      }
    }

    return await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        country: createOrderDto.country,
        quantity: createOrderDto.quantity,
        periodDays: createOrderDto.periodDays,
        proxyType: createOrderDto.proxyType,
        status: PaymentStatus.PENDING,
        tariff: createOrderDto.tariff,
        totalPrice: createOrderDto.totalPrice,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
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
