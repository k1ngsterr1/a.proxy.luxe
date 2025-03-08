import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CalcRequestDTO, CalcResidentRequestDTO } from './dto/request.dto';

@Controller('/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/references')
  async getReference() {
    return await this.productService.getProductReference();
  }

  @Post('/calc')
  async getCalc(@Body() body: CalcRequestDTO) {
    return await this.productService.getCalc(body);
  }

  @Post('/calc/resident')
  async getCalcResident(@Body() body: CalcResidentRequestDTO) {
    return await this.productService.getCalcResident(body);
  }

  @Get('active-list')
  async getActiveProxyList(@Query('type') type: string) {
    return await this.productService.getActiveProxyList(type);
  }
}
