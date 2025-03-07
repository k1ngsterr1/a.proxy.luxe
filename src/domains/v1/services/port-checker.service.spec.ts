import { Test, TestingModule } from '@nestjs/testing';
import { PortCheckerService } from './port-checker.service';

describe('PortCheckerService', () => {
  let service: PortCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortCheckerService],
    }).compile();

    service = module.get<PortCheckerService>(PortCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
