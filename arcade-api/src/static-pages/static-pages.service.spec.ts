import { Test, TestingModule } from '@nestjs/testing';
import { StaticPagesService } from './static-pages.service';

describe('StaticPagesService', () => {
  let service: StaticPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaticPagesService],
    }).compile();

    service = module.get<StaticPagesService>(StaticPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
