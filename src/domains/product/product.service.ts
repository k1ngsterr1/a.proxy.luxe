import { HttpException, Injectable } from '@nestjs/common';
import axios, { Axios, AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  ReferenceResponse,
  ReferenceSingleResponse,
} from './dto/reference.response';
import {
  ResponseCalcDTO,
  ResponseErrorDTO,
  ResponseReferenceDTO,
  ResponseReferenceSingleDTO,
} from './rdo/response.dto';
import { CalcRequest, CalcResidentRequest } from './dto/calc.request';
import { CalcRequestDTO, CalcResidentRequestDTO } from './dto/request.dto';
import { CalcResponse } from './rdo/calc.response';
import { ActiveProxy, ActiveProxyType } from './rdo/get-active-proxy.rdo';
import { Proxy } from '@prisma/client';
import { OrderInfo } from './dto/order.dto';

@Injectable()
export class ProductService {
  private readonly proxySeller: Axios;

  constructor(private readonly configService: ConfigService) {
    axios.defaults.baseURL = `https://proxy-seller.com/personal/api/v1/${configService.get<string>('PROXY_SELLER')}`;
    this.proxySeller = axios;
  }

  async getProductReference(): Promise<
    ResponseReferenceDTO | ResponseErrorDTO
  > {
    const response: AxiosResponse<ReferenceResponse> =
      await this.proxySeller.get('/reference/list');
    const reference = response.data;

    if (!reference.data) {
      return {
        status: 'error',
        message: 'Error accessing the service. Repeat the request later!',
      };
    }

    const isp = reference.data.isp;
    const ipv6 = reference.data.ipv6;
    const resident = reference.data.resident;
    const amounts = [
      {
        id: '1',
        text: '1 шт',
      },
      {
        id: '10',
        text: '10 шт',
      },
      {
        id: '20',
        text: '20 шт',
      },
      {
        id: '30',
        text: '30 шт',
      },
      {
        id: '50',
        text: '50 шт',
      },
      {
        id: '100',
        text: '100 шт',
      },
    ];

    return {
      status: 'success',
      isp: {
        country: isp?.country,
        period: isp?.period,
        targets: isp?.target?.map(({ sectionId, name }) => ({
          sectionId,
          name,
        })),
      },
      ipv6: {
        country: ipv6?.country,
        period: ipv6?.period,
        targets: ipv6?.target?.map(({ sectionId, name }) => ({
          sectionId,
          name,
        })),
      },
      resident: {
        tariffs: resident?.tarifs,
        targets: resident?.target?.map(({ sectionId, name }) => ({
          sectionId,
          name,
        })),
      },
      amounts: amounts,
    };
  }
  async getProductReferenceByType(
    type: string,
  ): Promise<ResponseReferenceSingleDTO | ResponseErrorDTO> {
    if (!Object.keys(Proxy).includes(type)) {
      throw new HttpException('Invalid type', 400);
    }
    const response: AxiosResponse<ReferenceSingleResponse> =
      await this.proxySeller.get(`/reference/list/${type}`);
    const reference = response.data;

    if (!reference.data) {
      return {
        status: 'error',
        message: 'Error accessing the service. Repeat the request later!',
      };
    }
    const amounts = [
      {
        id: '10',
        text: '10 шт',
      },
      {
        id: '20',
        text: '20 шт',
      },
      {
        id: '30',
        text: '30 шт',
      },
      {
        id: '50',
        text: '50 шт',
      },
      {
        id: '100',
        text: '100 шт',
      },
    ];

    return {
      status: 'success',
      country: reference?.data.items.country,
      targets: reference?.data.items.target.map(({ sectionId, name }) => ({
        sectionId,
        name,
      })),
      period: reference?.data.items.period,
      tariffs: reference?.data.items.tarifs,
      amounts: type !== 'resident' ? amounts : undefined,
    };
  }

  async getCalc(
    query: CalcRequestDTO,
  ): Promise<ResponseCalcDTO | ResponseErrorDTO> {
    if (query.type === 'resident') {
      throw new HttpException('Invalid type! Use other route', 400);
    }

    if (query.type === 'ipv6' && query.protocol === undefined) {
      throw new HttpException('Invalid protocol for ipv6', 400);
    }
    if (query.type === 'ipv6' && query.quantity < 10) {
      throw new HttpException(
        'Number of proxies for ipv6 must be at least 10',
        400,
      );
    }

    const price = query.type === 'ipv6' ? 0.1 : 2.4;
    const totalPrice = price * query.quantity;

    return {
      status: 'success',
      price: parseFloat(price.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };
  }

  async getCalcResident(
    query: CalcResidentRequestDTO,
  ): Promise<ResponseCalcDTO | ResponseErrorDTO> {
    const price = 2.4;
    const totalPrice = price * parseInt(query.quantity);

    return {
      status: 'success',
      price: parseFloat(price.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };
  }

  async getActiveProxyList(type: string | undefined) {
    if (type && !Object.keys(ActiveProxyType).includes(type)) {
      throw new HttpException('Invalid proxy type', 400);
    }
    try {
      const response: AxiosResponse<ActiveProxy[]> = await this.proxySeller.get(
        `/proxy/list${type ? `/${type}` : ''}`,
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching active proxy list:', error);
      return {
        status: 'error',
        message: 'Error fetching active proxy list',
      };
    }
  }

  async placeOrder(orderInfo: OrderInfo) {
    try {
      const response = await this.proxySeller.post('/order/make', orderInfo);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to place an order', 500);
    }
  }
}
