import { Test, TestingModule } from '@nestjs/testing';
import { AnonymityCheckerService } from './anonymity-checker.service';

describe('AnonymityCheckerService', () => {
  let service: AnonymityCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonymityCheckerService],
    }).compile();

    service = module.get<AnonymityCheckerService>(AnonymityCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
