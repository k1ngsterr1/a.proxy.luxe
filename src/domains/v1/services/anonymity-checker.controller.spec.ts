import { Test, TestingModule } from '@nestjs/testing';
import { AnonymityCheckerController } from './anonymity-checker.controller';

describe('AnonymityCheckerController', () => {
  let controller: AnonymityCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymityCheckerController],
    }).compile();

    controller = module.get<AnonymityCheckerController>(AnonymityCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
