import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

describe('Controlador de Produtor (unitário)', () => {
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

  it('deve criar um produtor', async () => {
    const dto: CreateProducerDto = { name: mockProducer.name, taxId: mockProducer.taxId };
    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(mockProducer);
  });

  it('deve retornar todos os produtores', async () => {
    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([mockProducer]);
  });

  it('deve retornar um produtor por id', async () => {
    const res = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual(mockProducer);
  });

  it('deve atualizar um produtor', async () => {
    const dto: UpdateProducerDto = { name: 'Updated' } as UpdateProducerDto;
    const res = await controller.update('1', dto);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(res).toEqual(expect.objectContaining({ name: 'Updated' }));
  });

  it('deve remover um produtor', async () => {
    const res = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(res).toBeUndefined();
  });
});
