import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CalcRequestDTO, CalcResidentRequestDTO } from './dto/request.dto';
import { ModifyResidentProxyDTO } from './dto/modify-resident-proxy.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/references')
  async getReference() {
    return await this.productService.getProductReference();
  }

  @Get('/references/:type')
  async getReferenceByType(@Param('type') type: string) {
    return await this.productService.getProductReferenceByType(type);
  }

  @Get('geo/reference')
  async getGeoReference() {
    return await this.productService.getGeoReference();
  }

  @Post('/calc')
  async getCalc(@Body() body: CalcRequestDTO) {
    return await this.productService.getCalc(body);
  }

  @Post('/calc/resident')
  async getCalcResident(@Body() body: CalcResidentRequestDTO) {
    return await this.productService.getCalcResident(body);
  }

  @Post('modify-proxy/resident')
  @UseGuards(AuthGuard('jwt'))
  async addResidentProxyList(@Body() body: ModifyResidentProxyDTO) {
    return await this.productService.addResidentProxyList(body);
  }

  @Get('active-list/:type')
  @UseGuards(AuthGuard('jwt'))
  async getActiveProxyList(@Param('type') type: string, @Request() req) {
    return await this.productService.getActiveProxyList(req.user.id, type);
  }

  // @Post('prolong')
  // @UseGuards(AuthGuard('jwt'))
  // async prolongProxy(@Body() data: {}) {
  //   return await this.productService.prolongProxy(data);
  // }
}
