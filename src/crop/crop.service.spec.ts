import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropService } from './crop.service';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { NotFoundException } from '@nestjs/common';

describe('Serviço de Cultura (unitário)', () => {
  let service: CropService;
  let repository: Partial<Record<keyof Repository<Crop>, jest.Mock>> & any;

  const mockFarm = {
    id: 1,
    producer: { active: true }
  };

  const mockCrop: Crop = ({
    id: 1,
    year: 2024,
    food: 'Soja',
    farmId: 1,
    farm: mockFarm,
  } as unknown) as Crop;

  const mockQueryBuilder = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      manager: {
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
      },
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
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

  describe('create', () => {
    it('deve criar uma cultura quando a fazenda tem produtor ativo', async () => {
      const dto: CreateCropDto = { 
        year: mockCrop.year, 
        food: mockCrop.food, 
        farmId: mockCrop.farmId 
      };

      mockQueryBuilder.getOne.mockResolvedValueOnce(mockFarm);
      repository.create.mockReturnValue(mockCrop);
      repository.save.mockResolvedValue(mockCrop);

      const res = await service.create(dto);

      expect(repository.manager.createQueryBuilder).toHaveBeenCalledWith('farm', 'f');
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('f.producer', 'p');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('f.id = :farmId', { farmId: dto.farmId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('p.active = :active', { active: true });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockCrop);
      expect(res).toEqual(mockCrop);
    });

    it('deve lançar NotFoundException quando a fazenda não existe ou tem produtor inativo', async () => {
      const dto: CreateCropDto = { 
        year: mockCrop.year, 
        food: mockCrop.food, 
        farmId: mockCrop.farmId 
      };

      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar apenas culturas de fazendas com produtores ativos', async () => {
      mockQueryBuilder.getMany.mockResolvedValueOnce([mockCrop]);

      const list = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('crop.farm', 'farm');
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('farm.producer', 'producer');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('producer.active = :active', { active: true });
      expect(list).toEqual([mockCrop]);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cultura quando encontrada e pertencer a produtor ativo', async () => {
      mockQueryBuilder.getOne.mockResolvedValueOnce(mockCrop);

      const found = await service.findOne(1);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('crop.farm', 'farm');
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('farm.producer', 'producer');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('crop.id = :id', { id: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('producer.active = :active', { active: true });
      expect(found).toEqual(mockCrop);
    });

    it('deve lançar NotFoundException quando a cultura não existe ou pertence a produtor inativo', async () => {
      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma cultura quando a fazenda tem produtor ativo', async () => {
      const dto: UpdateCropDto = { food: 'Milho', farmId: 2 };
      
      mockQueryBuilder.getOne
        .mockResolvedValueOnce(mockCrop) // findOne inicial
        .mockResolvedValueOnce(mockFarm) // verificação da nova fazenda
        .mockResolvedValueOnce({ ...mockCrop, food: 'Milho' }); // findOne final

      repository.save.mockResolvedValueOnce({ id: 1, ...dto });
      const res = await service.update(1, dto);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(repository.manager.createQueryBuilder).toHaveBeenCalledWith('farm', 'f');
      expect(repository.save).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(res).toEqual({ ...mockCrop, food: 'Milho' });
    });
  });

  describe('remove', () => {
    it('deve remover uma cultura após verificar que existe e pertence a produtor ativo', async () => {
      mockQueryBuilder.getOne.mockResolvedValueOnce(mockCrop);
      repository.delete.mockResolvedValueOnce({ affected: 1 });

      await service.remove(1);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException ao tentar remover cultura inexistente ou de produtor inativo', async () => {
      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRecentCrops', () => {
    it('deve retornar safras recentes apenas de produtores ativos', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockCrop]);

      const res = await service.getRecentCrops(2);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('crop.farm', 'farm');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('farm.producer', 'producer');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('producer.active = :active', { active: true });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('crop.year', 'DESC');
      expect(res).toEqual([mockCrop]);
    });
  });
});
