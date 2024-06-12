import { Test, TestingModule } from '@nestjs/testing';
import { ShortlinkService } from './shortlink.service';

describe('ShortlinkService', () => {
  let service: ShortlinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortlinkService],
    }).compile();

    service = module.get<ShortlinkService>(ShortlinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
