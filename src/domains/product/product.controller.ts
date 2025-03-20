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

  @Post('/calc')
  async getCalc(@Body() body: CalcRequestDTO) {
    return await this.productService.getCalc(body);
  }

  @Post('/calc/resident')
  async getCalcResident(@Body() body: CalcResidentRequestDTO) {
    return await this.productService.getCalcResident(body);
  }

  @Get('active-list/:type')
  @UseGuards(AuthGuard('jwt'))
  async getActiveProxyList(@Param('type') type: string, @Request() req) {
    return await this.productService.getActiveProxyList(req.user.id, type);
  }
}
