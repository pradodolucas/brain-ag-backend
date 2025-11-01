import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

describe('ProducerController (unit)', () => {
  let controller: ProducerController;
  const mockProducer: Producer = ({
    id: 1,
    name: 'Ctrl Producer',
    taxId: '11122233344',
    active: true,
  } as unknown) as Producer;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockProducer),
    findAll: jest.fn().mockResolvedValue([mockProducer]),
    findOne: jest.fn().mockResolvedValue(mockProducer),
    update: jest.fn().mockResolvedValue({ ...mockProducer, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [{ provide: ProducerService, useValue: mockService }],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a producer', async () => {
    const dto: CreateProducerDto = { name: mockProducer.name, taxId: mockProducer.taxId };
    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(mockProducer);
  });

  it('should return all producers', async () => {
    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([mockProducer]);
  });

  it('should return one producer by id', async () => {
    const res = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual(mockProducer);
  });

  it('should update a producer', async () => {
    const dto: UpdateProducerDto = { name: 'Updated' } as UpdateProducerDto;
    const res = await controller.update('1', dto);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(res).toEqual(expect.objectContaining({ name: 'Updated' }));
  });

  it('should remove a producer', async () => {
    const res = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(res).toBeUndefined();
  });
});
