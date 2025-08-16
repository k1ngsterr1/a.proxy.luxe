import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SharedModule } from '../v1/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
