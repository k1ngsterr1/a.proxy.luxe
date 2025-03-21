import { Controller, Post, Body } from '@nestjs/common';
import { PortCheckDto } from './dto/port-check.dto';
import { PortCheckResultDto } from './dto/port-check-result.dto';
import { PortCheckerService } from './port-checker.service';

@Controller('v1/services/port-checker')
export class PortCheckerController {
  constructor(private readonly portCheckerService: PortCheckerService) {}

  @Post('check')
  async checkPort(
    @Body() portCheckDto: PortCheckDto,
  ): Promise<PortCheckResultDto> {
    return this.portCheckerService.checkPort(
      portCheckDto.ip,
      portCheckDto.port,
    );
  }
}
