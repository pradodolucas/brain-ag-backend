import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

describe('Controlador de Fazenda (unitário)', () => {
  let controller: FarmController;
  const mockFarm: Farm = ({
    id: 1,
    name: 'Fazenda Ctrl',
    state: 'SP',
    city: 'Campinas',
    totalArea: 1000,
    cultivableArea: 800,
    vegetationArea: 200,
    producerId: 1,
  } as unknown) as Farm;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockFarm),
    findAll: jest.fn().mockResolvedValue([mockFarm]),
    findOne: jest.fn().mockResolvedValue(mockFarm),
    update: jest.fn().mockResolvedValue({ ...mockFarm, name: 'Atualizada' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [{ provide: FarmService, useValue: mockService }],
    }).compile();

    controller = module.get<FarmController>(FarmController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar uma fazenda', async () => {
    const dto: CreateFarmDto = {
      name: mockFarm.name,
      state: mockFarm.state,
      city: mockFarm.city,
      totalArea: mockFarm.totalArea,
      cultivableArea: mockFarm.cultivableArea,
      vegetationArea: mockFarm.vegetationArea,
      producerId: mockFarm.producerId,
    } as CreateFarmDto;

    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(mockFarm);
  });

  it('deve retornar todas as fazendas', async () => {
    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([mockFarm]);
  });

  it('deve retornar uma fazenda por id', async () => {
    const res = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual(mockFarm);
  });

  it('deve atualizar uma fazenda', async () => {
    const dto: UpdateFarmDto = { name: 'Atualizada' } as UpdateFarmDto;
    const res = await controller.update('1', dto);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(res).toEqual(expect.objectContaining({ name: 'Atualizada' }));
  });

  it('deve remover uma fazenda', async () => {
    const res = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(res).toBeUndefined();
  });
});
describe.skip('removed tests', () => {});
