import { Test, TestingModule } from '@nestjs/testing';
import { StaticPagesController } from './static-pages.controller';

describe('StaticPagesController', () => {
  let controller: StaticPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticPagesController],
    }).compile();

    controller = module.get<StaticPagesController>(StaticPagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
