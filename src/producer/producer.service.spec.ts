import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProducerService } from './producer.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';

describe('ProducerService (unit simple)', () => {
  let service: ProducerService;
  let repository: Repository<Producer>;

  const mockProducer = {
    id: 1,
    name: 'Simple Unit Producer',
    taxId: '55544433322211',
    active: true,
  } as Producer;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a producer and retrieves it', async () => {
    const dto: CreateProducerDto = { name: mockProducer.name, taxId: mockProducer.taxId };

    mockRepository.findOne.mockResolvedValueOnce(null); // create conflict check
    mockRepository.create.mockReturnValue(mockProducer);
    mockRepository.save.mockResolvedValue(mockProducer);
    mockRepository.findOne.mockResolvedValueOnce(mockProducer);

    const created = await service.create(dto);
    expect(created).toEqual(mockProducer);

    const found = await service.findOne(1);
    expect(found).toEqual(mockProducer);
  });
});