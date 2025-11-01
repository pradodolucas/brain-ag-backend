import { Test, TestingModule } from '@nestjs/testing';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

describe('Controlador de Cultura (unitário)', () => {
  let controller: CropController;
  const mockCrop: Crop = ({
    id: 1,
    year: 2024,
    food: 'Soja',
    farmId: 1,
  } as unknown) as Crop;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCrop),
    findAll: jest.fn().mockResolvedValue([mockCrop]),
    findOne: jest.fn().mockResolvedValue(mockCrop),
    update: jest.fn().mockResolvedValue({ ...mockCrop, food: 'Milho' }),
    remove: jest.fn().mockResolvedValue(undefined),
    getRecentCrops: jest.fn().mockResolvedValue([mockCrop]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [{ provide: CropService, useValue: mockService }],
    }).compile();

    controller = module.get<CropController>(CropController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar uma cultura', async () => {
    const dto: CreateCropDto = { year: mockCrop.year, food: mockCrop.food, farmId: mockCrop.farmId } as CreateCropDto;
    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(mockCrop);
  });

  it('deve retornar todas as culturas', async () => {
    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([mockCrop]);
  });

  it('deve retornar uma cultura por id', async () => {
    const res = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual(mockCrop);
  });

  it('deve atualizar uma cultura', async () => {
    const dto: UpdateCropDto = { food: 'Milho' } as UpdateCropDto;
    const res = await controller.update('1', dto);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(res).toEqual(expect.objectContaining({ food: 'Milho' }));
  });

  it('deve remover uma cultura', async () => {
    const res = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(res).toBeUndefined();
  });

  it('deve retornar safras recentes', async () => {
  const res = await controller.getRecentCrops(2);
  expect(mockService.getRecentCrops).toHaveBeenCalledWith(2);
    expect(res).toEqual([mockCrop]);
  });
});
describe.skip('removed tests', () => {});
