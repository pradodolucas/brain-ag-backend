import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmService } from './farm.service';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

describe('Serviço de Fazenda (unitário)', () => {
  let service: FarmService;
  let repository: Partial<Record<keyof Repository<Farm>, jest.Mock>> & any;

  const mockFarm: Farm = ({
    id: 1,
    name: 'Fazenda Teste',
    state: 'SP',
    city: 'Campinas',
    totalArea: 1000,
    cultivableArea: 800,
    vegetationArea: 200,
    producerId: 1,
    crops: [],
  } as unknown) as Farm;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        { provide: getRepositoryToken(Farm), useValue: repository },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
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

    repository.create.mockReturnValue(mockFarm);
    repository.save.mockResolvedValue(mockFarm);

    const res = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto as any);
    expect(repository.save).toHaveBeenCalledWith(mockFarm as any);
    expect(res).toEqual(mockFarm);
  });

  it('deve retornar todas as fazendas', async () => {
    repository.find.mockResolvedValueOnce([mockFarm]);
    const list = await service.findAll();
    expect(repository.find).toHaveBeenCalledWith({ relations: ['producer', 'crops'] });
    expect(list).toEqual([mockFarm]);
  });

  it('deve retornar uma fazenda por id quando existir', async () => {
    repository.findOne.mockResolvedValueOnce(mockFarm);
    const found = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['producer', 'crops'] });
    expect(found).toEqual(mockFarm);
  });

  it('deve atualizar uma fazenda', async () => {
    const updateDto: UpdateFarmDto = { name: 'Fazenda Atualizada' } as UpdateFarmDto;
    repository.update.mockResolvedValueOnce({} as any);
    repository.findOne.mockResolvedValueOnce({ ...mockFarm, name: 'Fazenda Atualizada' });

    const res = await service.update(1, updateDto);
    expect(repository.update).toHaveBeenCalledWith(1, updateDto as any);
  });

  it('deve remover uma fazenda', async () => {
    repository.delete.mockResolvedValueOnce({} as any);
    await expect(service.remove(1)).resolves.toBeDefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
describe.skip('removed tests', () => {});