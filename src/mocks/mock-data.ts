import { Producer } from '../producer/entities/producer.entity';
import { Farm } from '../farm/entities/farm.entity';
import { Crop } from '../crop/entities/crop.entity';

export const sampleProducer: Producer = ({
  id: 1,
  name: 'Produtor Mock',
  taxId: '12345678901',
  active: true,
} as unknown) as Producer;

export const sampleFarm: Farm = ({
  id: 1,
  name: 'Fazenda Mock',
  state: 'MG',
  city: 'Belo Horizonte',
  totalArea: 500,
  cultivableArea: 400,
  vegetationArea: 100,
  producerId: sampleProducer.id,
} as unknown) as Farm;

export const sampleCrop: Crop = ({
  id: 1,
  year: new Date().getFullYear(),
  food: 'Soja',
  farmId: sampleFarm.id,
} as unknown) as Crop;

export const producers: Producer[] = [sampleProducer];
export const farms: Farm[] = [sampleFarm];
export const crops: Crop[] = [sampleCrop];

export default { producers, farms, crops };
