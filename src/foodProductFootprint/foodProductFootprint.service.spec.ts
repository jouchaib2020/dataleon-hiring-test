import { Test, TestingModule } from '@nestjs/testing';
import { AgrybaliseCarbonFootPrintService } from './agrybalise-carbon-foot-print.service';

describe('AgrybaliseCarbonFootPrintService', () => {
  let service: AgrybaliseCarbonFootPrintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgrybaliseCarbonFootPrintService],
    }).compile();

    service = module.get<AgrybaliseCarbonFootPrintService>(AgrybaliseCarbonFootPrintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
