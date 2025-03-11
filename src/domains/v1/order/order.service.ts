import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { FinishOrderDto } from './dto/payment-order.dto';
import { PaymentGateway, PaymentStatus, ProxyType } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { ProductService } from 'src/domains/product/product.service';
import { OrderInfo } from 'src/domains/product/dto/order.dto';

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
      const isValidPeriod = reference.period.some(
        (period) => period.id === createOrderDto.periodDays,
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
        type: createOrderDto.type,
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

  async finishOrder(paymentDto: FinishOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: paymentDto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Order already processed');
    }
    const reference = await this.productService.getProductReferenceByType(
      order.type,
    );

    if (reference.status !== 'success') {
      throw new HttpException(
        reference.message || 'Invalid reference data',
        400,
      );
    }
    const orderInfo: OrderInfo = {
      paymentId: 1,
      tariffId: reference.tariffs?.find(
        (tariff) => tariff.name === order.tariff,
      )?.id,
      countryId: reference.country?.find(
        (country) => order.country && country.name.endsWith(order.country),
      )?.id,
      periodId: order.periodDays ? order.periodDays : undefined,
      quantity: order.quantity ? order.quantity : undefined,
      protocol: order.proxyType,
    };

    return await this.productService.placeOrder(orderInfo);
  }

  private mockPaymentGateway(gateway: PaymentGateway): boolean {
    // Реальная интеграция с платежными шлюзами
    console.log(`Processing payment via ${gateway}`);
    return true; // Всегда успешная оплата для примера
  }
}
