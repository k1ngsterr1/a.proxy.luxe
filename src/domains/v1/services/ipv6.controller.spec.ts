import { Test, TestingModule } from '@nestjs/testing';
import { Ipv6Controller } from './ipv6.controller';

describe('Ipv6Controller', () => {
  let controller: Ipv6Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Ipv6Controller],
    }).compile();

    controller = module.get<Ipv6Controller>(Ipv6Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
