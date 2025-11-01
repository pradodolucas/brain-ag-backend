import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create(createFarmDto as any);
    const saved = await this.farmRepository.save(farm as any);
    return saved as any;
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({ relations: ['producer', 'crops'] });
  }

  async findOne(id: number): Promise<Farm | null> {
    return this.farmRepository.findOne({ where: { id }, relations: ['producer', 'crops'] });
  }

  async update(id: number, updateFarmDto: UpdateFarmDto) {
    return this.farmRepository.update(id, updateFarmDto as any);
  }

  async remove(id: number) {
    return this.farmRepository.delete(id);
  }
}
