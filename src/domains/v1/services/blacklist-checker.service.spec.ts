import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistCheckerService } from './blacklist-checker.service';

describe('BlacklistCheckerService', () => {
  let service: BlacklistCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistCheckerService],
    }).compile();

    service = module.get<BlacklistCheckerService>(BlacklistCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
