import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { FinishOrderDto } from './dto/payment-order.dto';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { ProductService } from 'src/domains/product/product.service';
import { OrderInfo } from 'src/domains/product/dto/order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private productService: ProductService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    if (
      createOrderDto.type !== 'resident' &&
      createOrderDto.quantity === undefined
    ) {
      throw new HttpException('Invalid quantity', 400);
    }
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
    if (createOrderDto.type === 'resident') {
      createOrderDto.quantity = 1;
    }

    const totalPrice = await this.productService.getCalcForOrder(
      createOrderDto.type,
      createOrderDto.quantity,
    );

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
        totalPrice: totalPrice,
      },
    });
  }

  async findAll(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const orders = await this.prisma.order.findMany({
      where: { userId: userId, status: 'PENDING' },
      skip: skip,
      take: limit,
    });

    const total = await this.prisma.order.count({
      where: { userId: userId, status: 'PENDING' },
    });

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException(`Order with ID ${orderId} not found`, 404);
    }

    return order;
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

    const user = await this.prisma.user.findUnique({
      where: { id: order.userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (new Decimal(user.balance).lt(order.totalPrice)) {
      throw new HttpException('Insufficient balance', 400);
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
      tarifId: reference.tariffs?.find((tariff) => tariff.name === order.tariff)
        ?.id,
      countryId: reference.country?.find(
        (country) => order.country && country.name.endsWith(order.country),
      )?.id,
      customTargetName: 'Proxy for proxy.luxe buyers',
      periodId: order.periodDays ? order.periodDays : undefined,
      quantity: order.quantity ? order.quantity : undefined,
      protocol: order.proxyType ? order.proxyType : undefined,
    };

    const placedOrder = await this.productService.placeOrder(orderInfo);

    await this.prisma.order.update({
      where: { id: order.id },
      data: { proxySellerId: placedOrder },
    });
    await this.prisma.user.update({
      where: { id: order.id },
      data: { balance: { increment: -order.totalPrice } },
    });

    return { message: 'Successfully finished order' };
  }
}
