import { HttpException, Injectable } from '@nestjs/common';
import axios, { Axios, AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  ReferenceData,
  ReferenceError,
  ReferenceResponse,
} from './dto/reference.response';
import {
  ResponseCalcDTO,
  ResponseErrorDTO,
  ResponseReferenceDTO,
} from './rdo/response.dto';
import { CalcRequest, CalcResidentRequest } from './dto/calc.request';
import { CalcRequestDTO, CalcResidentRequestDTO } from './dto/request.dto';
import { CalcResponse } from './rdo/calc.response';
import { ActiveProxy, ActiveProxyType } from './rdo/get-active-proxy.rdo';

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
        country: isp?.country.map((item) => ({
          id: `${item.id}`,
          text: `${item.name}`,
        })),
        targets: isp?.target.map((item) => ({
          id: `${item.sectionId}`,
          text: `${item.name}`,
        })),
        period: isp?.period.map((item) => ({
          id: `${item.id}`,
          text: `${item.name}`,
        })),
      },
      ipv6: {
        country: ipv6?.country.map((item) => ({
          id: `${item.id}`,
          text: `${item.name}`,
        })),
        targets: ipv6?.target.map((item) => ({
          id: `${item.sectionId}`,
          text: `${item.name}`,
        })),
        period: ipv6?.period.map((item) => ({
          id: `${item.id}`,
          text: `${item.name}`,
        })),
      },
      resident: {
        tariffs: resident.tarifs.map((item) => ({
          id: `${item.id}`,
          text: `${item.name}`,
        })),
        targets: resident.target.map((item) => ({
          id: `${item.sectionId}`,
          text: `${item.name}`,
        })),
      },
      amounts: amounts,
    };
  }

  async getCalc(
    query: CalcRequestDTO,
  ): Promise<ResponseCalcDTO | ResponseErrorDTO> {
    const request: CalcRequest = {
      countryId: query.countryId,
      periodId: query.periodId,
      quantity: query.quantity,
      paymentId: 1,
      customTargetName: query.customTargetName,
    };

    if (query.protocol) {
      request.protocol = query.protocol;
    }

    const response: AxiosResponse<CalcResponse> = await this.proxySeller.post(
      '/order/calc',
      request,
    );
    console.log(response.data);

    const calc = response.data;

    if (!calc.data) {
      return {
        status: 'error',
        message: 'Error accessing the service. Repeat the request later!',
        error: calc.errors[0].message,
      };
    }

    const price = calc.data.price * 1.5;
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
    const request: CalcResidentRequest = {
      coupon: '',
      paymentId: 1,
      tarifId: query.tariffId,
    };
    const response: AxiosResponse<CalcResponse> = await this.proxySeller.post(
      '/order/calc',
      request,
    );
    const calc = response.data;
    console.log(calc);
    if (!calc.data) {
      return {
        status: 'error',
        message: 'Error accessing the service. Repeat the request later!',
      };
    }

    const price = calc.data.price * 1.5;
    const totalPrice = price * query.quantity;

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
}
