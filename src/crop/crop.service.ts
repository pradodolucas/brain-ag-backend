import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    // Verificar se a fazenda existe e pertence a um produtor ativo
    const farm = await this.cropRepository.manager
      .createQueryBuilder('farm', 'f')
      .innerJoinAndSelect('f.producer', 'p')
      .where('f.id = :farmId', { farmId: createCropDto.farmId })
      .andWhere('p.active = :active', { active: true })
      .getOne();

    if (!farm) {
      throw new NotFoundException(`Farm with ID ${createCropDto.farmId} not found or belongs to inactive producer`);
    }

    const crop = this.cropRepository.create(createCropDto);
    return await this.cropRepository.save(crop);
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository
      .createQueryBuilder('crop')
      .innerJoinAndSelect('crop.farm', 'farm')
      .innerJoinAndSelect('farm.producer', 'producer')
      .where('producer.active = :active', { active: true })
      .getMany();
  }

  async findOne(id: number): Promise<Crop> {
    const crop = await this.cropRepository
      .createQueryBuilder('crop')
      .innerJoinAndSelect('crop.farm', 'farm')
      .innerJoinAndSelect('farm.producer', 'producer')
      .where('crop.id = :id', { id })
      .andWhere('producer.active = :active', { active: true })
      .getOne();

    if (!crop) {
      throw new NotFoundException(`Crop with ID ${id} not found or belongs to inactive producer`);
    }

    return crop;
  }

  async getRecentCrops(years: number): Promise<Crop[]> {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - (years - 1);

    return this.cropRepository
      .createQueryBuilder('crop')
      .leftJoinAndSelect('crop.farm', 'farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .where('crop.year >= :minYear', { minYear })
      .andWhere('producer.active = :active', { active: true })
      .orderBy('crop.year', 'DESC')
      .getMany();
  } 

  async update(id: number, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    
    if (updateCropDto.farmId) {
      // Se está alterando a fazenda, verificar se a nova fazenda existe e pertence a produtor ativo
      const newFarm = await this.cropRepository.manager
        .createQueryBuilder('farm', 'f')
        .innerJoinAndSelect('f.producer', 'p')
        .where('f.id = :farmId', { farmId: updateCropDto.farmId })
        .andWhere('p.active = :active', { active: true })
        .getOne();

      if (!newFarm) {
        throw new NotFoundException(`Farm with ID ${updateCropDto.farmId} not found or belongs to inactive producer`);
      }
    }

    const updateResult = await this.cropRepository.save({ id, ...updateCropDto });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Verificar se a cultura existe e pertence a uma fazenda de produtor ativo
    await this.findOne(id);
    await this.cropRepository.delete(id);
  }
}
