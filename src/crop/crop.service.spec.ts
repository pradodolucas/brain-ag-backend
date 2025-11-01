import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropService } from './crop.service';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

describe('Serviço de Cultura (unitário)', () => {
  let service: CropService;
  let repository: Partial<Record<keyof Repository<Crop>, jest.Mock>> & any;

  const mockCrop: Crop = ({
    id: 1,
    year: 2024,
    food: 'Soja',
    farmId: 1,
    farm: undefined,
  } as unknown) as Crop;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        { provide: getRepositoryToken(Crop), useValue: repository },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar uma cultura', async () => {
    const dto: CreateCropDto = { year: mockCrop.year, food: mockCrop.food, farmId: mockCrop.farmId } as CreateCropDto;
    repository.create.mockReturnValue(mockCrop);
    repository.save.mockResolvedValue(mockCrop);

    const res = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto as any);
    expect(repository.save).toHaveBeenCalledWith(mockCrop as any);
    expect(res).toEqual(mockCrop);
  });

  it('deve retornar todas as culturas', async () => {
    repository.find.mockResolvedValueOnce([mockCrop]);
    const list = await service.findAll();
    expect(repository.find).toHaveBeenCalledWith({ relations: ['farm'] });
    expect(list).toEqual([mockCrop]);
  });

  it('deve retornar uma cultura por id', async () => {
    repository.findOne.mockResolvedValueOnce(mockCrop);
    const found = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['farm'] });
    expect(found).toEqual(mockCrop);
  });

  it('deve atualizar uma cultura', async () => {
    const dto: UpdateCropDto = { food: 'Milho' } as UpdateCropDto;
    repository.update.mockResolvedValueOnce({} as any);
    repository.findOne.mockResolvedValueOnce({ ...mockCrop, food: 'Milho' });

    const res = await service.update(1, dto);
    expect(repository.update).toHaveBeenCalledWith(1, dto as any);
  });

  it('deve remover uma cultura', async () => {
    repository.delete.mockResolvedValueOnce({} as any);
    await expect(service.remove(1)).resolves.toBeDefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('deve retornar safras recentes via queryBuilder', async () => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockCrop]),
    };

    repository.createQueryBuilder.mockReturnValue(qb);

    const res = await service.getRecentCrops(2);
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('crop');
    expect(qb.where).toHaveBeenCalled();
    expect(res).toEqual([mockCrop]);
  });
});
describe.skip('removed tests', () => {});
