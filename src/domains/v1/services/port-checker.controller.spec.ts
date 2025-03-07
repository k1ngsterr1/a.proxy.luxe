import { Test, TestingModule } from '@nestjs/testing';
import { PortCheckerController } from './port-checker.controller';

describe('PortCheckerController', () => {
  let controller: PortCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortCheckerController],
    }).compile();

    controller = module.get<PortCheckerController>(PortCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
