import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistCheckerController } from './blacklist-checker.controller';

describe('BlacklistCheckerController', () => {
  let controller: BlacklistCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlacklistCheckerController],
    }).compile();

    controller = module.get<BlacklistCheckerController>(BlacklistCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
