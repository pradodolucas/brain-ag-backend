import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProducerService } from './producer.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('Serviço de Produtor (unitário)', () => {
  let service: ProducerService;
  let repository: Partial<Record<keyof Repository<Producer>, jest.Mock>> & any;

  const mockProducer: Producer = {
    id: 1,
    name: 'Unit Producer',
    taxId: '55544433322211',
    active: true,
    farms: [],
  } as unknown as Producer;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar um produtor quando o taxId for único', async () => {
    const dto: CreateProducerDto = { name: mockProducer.name, taxId: mockProducer.taxId };

    repository.findOne.mockResolvedValueOnce(null); // check existing
    repository.create.mockReturnValue(mockProducer);
    repository.save.mockResolvedValue(mockProducer);

    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mockProducer);
    expect(result).toEqual(mockProducer);
  });

  it('deve lançar ConflictException ao tentar criar com taxId já existente', async () => {
    const dto: CreateProducerDto = { name: mockProducer.name, taxId: mockProducer.taxId };
    repository.findOne.mockResolvedValueOnce(mockProducer);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('deve retornar todos os produtores ativos', async () => {
    repository.find.mockResolvedValueOnce([mockProducer]);
    const list = await service.findAll();
    expect(repository.find).toHaveBeenCalledWith({ where: { active: true }, relations: ['farms'] });
    expect(list).toEqual([mockProducer]);
  });

  it('deve retornar um produtor quando encontrado', async () => {
    repository.findOne.mockResolvedValueOnce(mockProducer);
    const found = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1, active: true }, relations: ['farms'] });
    expect(found).toEqual(mockProducer);
  });

  it('deve lançar NotFoundException quando findOne não encontrar', async () => {
    repository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve atualizar o produtor com sucesso', async () => {
    const updateDto: UpdateProducerDto = { name: 'Updated Name' } as UpdateProducerDto;

    // sequence: findOne(id) for existence, then findOne for taxId conflict (if provided), then update, then findOne to return updated
    repository.findOne
      .mockResolvedValueOnce(mockProducer) // existence check
      .mockResolvedValueOnce({ ...mockProducer, name: 'Updated Name' }); // final findOne

    repository.update.mockResolvedValueOnce({} as any);

    const updated = await service.update(1, updateDto);
    expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    expect(updated.name).toBe('Updated Name');
  });

  it('deve lançar ConflictException quando atualizar taxId para um já utilizado', async () => {
    const updateDto: UpdateProducerDto = { taxId: '99988877766' } as UpdateProducerDto;
    repository.findOne
      .mockResolvedValueOnce(mockProducer) // existence check
      .mockResolvedValueOnce({ id: 2, taxId: '99988877766' }); // conflict found

    await expect(service.update(1, updateDto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('deve remover (soft-delete) um produtor', async () => {
    repository.findOne.mockResolvedValueOnce(mockProducer);
    repository.update.mockResolvedValueOnce({} as any);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining({ active: false }));
  });
});