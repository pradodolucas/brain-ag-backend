import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    // Verificar se já existe produtor com mesmo taxId
    const existingProducer = await this.producerRepository.findOne({
      where: { taxId: createProducerDto.taxId, active: true }
    });

    if (existingProducer) {
      throw new ConflictException('Producer with this taxId already exists');
    }

    const producer = this.producerRepository.create(createProducerDto);
    return await this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find({ 
      where: { active: true },
      relations: ['farms'] 
    });
  }

  async findOne(id: number): Promise<Producer> {
    const producer = await this.producerRepository.findOne({ 
      where: { id, active: true }, 
      relations: ['farms'] 
    });

    if (!producer) {
      throw new NotFoundException(`Producer with ID ${id} not found`);
    }

    return producer;
  }

  async update(id: number, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    // Verificar se existe
    await this.findOne(id);

    // Se está tentando mudar taxId, verificar se não existe outro
    if (updateProducerDto.taxId) {
      const existingWithTaxId = await this.producerRepository.findOne({
        where: { taxId: updateProducerDto.taxId, active: true }
      });

      if (existingWithTaxId && existingWithTaxId.id !== id) {
        throw new ConflictException('TaxId already in use by another producer');
      }
    }

    await this.producerRepository.update(id, updateProducerDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const producer = await this.findOne(id);
    
    // Exclusão lógica
    await this.producerRepository.update(id, { 
      active: false, 
      deletedAt: new Date() 
    });
  }
}