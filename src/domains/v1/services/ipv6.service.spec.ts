import { Test, TestingModule } from '@nestjs/testing';
import { Ipv6Service } from './ipv6.service';

describe('Ipv6Service', () => {
  let service: Ipv6Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Ipv6Service],
    }).compile();

    service = module.get<Ipv6Service>(Ipv6Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
