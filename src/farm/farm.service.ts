import { Injectable, NotFoundException } from '@nestjs/common';
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
    // Verificar se o produtor está ativo
    const producer = await this.farmRepository.manager.findOne('Producer', {
      where: { 
        id: createFarmDto.producerId,
        active: true
      }
    });

    if (!producer) {
      throw new NotFoundException(`Producer with ID ${createFarmDto.producerId} not found or inactive`);
    }

    const farm = this.farmRepository.create(createFarmDto);
    return await this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({ 
      relations: ['producer', 'crops'],
      where: {
        producer: {
          active: true
        }
      }
    });
  }

  async findOne(id: number): Promise<Farm | null> {
    const farm = await this.farmRepository.findOne({ 
      where: { 
        id,
        producer: {
          active: true
        }
      }, 
      relations: ['producer', 'crops'] 
    });

    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found or belongs to inactive producer`);
    }

    return farm;
  }

  async update(id: number, updateFarmDto: UpdateFarmDto): Promise<Farm | null> {
    const farm = await this.findOne(id);
    
    if (updateFarmDto.producerId) {
      // Se está alterando o produtor, verificar se o novo produtor está ativo
      const newProducer = await this.farmRepository.manager.findOne('Producer', {
        where: { 
          id: updateFarmDto.producerId,
          active: true
        }
      });

      if (!newProducer) {
        throw new NotFoundException(`Producer with ID ${updateFarmDto.producerId} not found or inactive`);
      }
    }

    await this.farmRepository.update(id, updateFarmDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Verificar se a fazenda existe e pertence a um produtor ativo
    await this.findOne(id);
    await this.farmRepository.delete(id);
  }
}