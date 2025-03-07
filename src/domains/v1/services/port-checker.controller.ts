import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PortCheckDto } from './dto/port-check.dto';
import { PortCheckResultDto } from './dto/port-check-result.dto';
import { PortCheckerService } from './port-checker.service';

@ApiTags('Services')
@Controller('services/port-checker')
export class PortCheckerController {
  constructor(private readonly portCheckerService: PortCheckerService) {}

  @Post('check')
  @ApiOperation({
    summary: 'Проверить открыт ли порт',
    description: 'Проверяет доступность порта на указанном IP адресе',
  })
  @ApiResponse({
    status: 200,
    description: 'Результат проверки порта',
    type: PortCheckResultDto,
  })
  async checkPort(
    @Body() portCheckDto: PortCheckDto,
  ): Promise<PortCheckResultDto> {
    return this.portCheckerService.checkPort(
      portCheckDto.ip,
      portCheckDto.port,
    );
  }
}
