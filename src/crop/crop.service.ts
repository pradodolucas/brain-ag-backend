import { Injectable } from '@nestjs/common';
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
    const crop = this.cropRepository.create(createCropDto as any);
    const saved = await this.cropRepository.save(crop as any);
    return saved as any;
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find({ relations: ['farm'] });
  }

  async findOne(id: number): Promise<Crop | null> {
    return this.cropRepository.findOne({ where: { id }, relations: ['farm'] });
  }

  async getRecentCrops(years: number): Promise<Crop[]> {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - (years - 1);

    return this.cropRepository
      .createQueryBuilder('crop')
      .where('crop.year >= :minYear', { minYear })
      .orderBy('crop.year', 'DESC')
      .getMany();
  }

  async update(id: number, updateCropDto: UpdateCropDto) {
    return this.cropRepository.update(id, updateCropDto as any);
  }

  async remove(id: number) {
    return this.cropRepository.delete(id);
  }
}
