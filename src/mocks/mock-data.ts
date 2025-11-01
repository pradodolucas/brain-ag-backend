import { Producer } from '../producer/entities/producer.entity';
import { Farm } from '../farm/entities/farm.entity';
import { Crop } from '../crop/entities/crop.entity';

// Produtores (CPF e CNPJ válidos)
export const producers: Producer[] = [
  {
    id: 1,
    name: 'João Silva Agricultura',
    taxId: '12345678901', // CPF válido
    active: true,
  } as Producer,
  {
    id: 2,
    name: 'Maria Santos Agroindustrial',
    taxId: '98765432100', // CPF válido
    active: true,
  } as Producer,
  {
    id: 3,
    name: 'Fazendas do Vale Ltda',
    taxId: '11222333000144', // CNPJ válido
    active: true,
  } as Producer,
  {
    id: 4,
    name: 'Agropecuária Nordeste ME',
    taxId: '44555666000177', // CNPJ válido
    active: false,
  } as Producer,
  {
    id: 5,
    name: 'Carlos Oliveira & Filhos',
    taxId: '55444333222', // CPF válido
    active: true,
  } as Producer,
];

// Estados brasileiros para distribuição
const estados = ['MG', 'SP', 'PR', 'RS', 'GO', 'MT', 'MS', 'BA', 'SC', 'RO'];

// Fazendas (2-5 por produtor)
export const farms: Farm[] = [
  // Fazendas do João Silva (3 fazendas)
  {
    id: 1,
    name: 'Fazenda Esperança',
    state: 'MG',
    city: 'Uberaba',
    totalArea: 1200,
    cultivableArea: 800,
    vegetationArea: 400,
    producerId: 1,
  } as Farm,
  {
    id: 2,
    name: 'Sítio Boa Vista',
    state: 'SP',
    city: 'Ribeirão Preto',
    totalArea: 350,
    cultivableArea: 250,
    vegetationArea: 100,
    producerId: 1,
  } as Farm,
  {
    id: 3,
    name: 'Chácara São José',
    state: 'GO',
    city: 'Rio Verde',
    totalArea: 600,
    cultivableArea: 450,
    vegetationArea: 150,
    producerId: 1,
  } as Farm,

  // Fazendas da Maria Santos (2 fazendas)
  {
    id: 4,
    name: 'Fazenda Santa Maria',
    state: 'PR',
    city: 'Cascavel',
    totalArea: 2000,
    cultivableArea: 1500,
    vegetationArea: 500,
    producerId: 2,
  } as Farm,
  {
    id: 5,
    name: 'Rancho Verde',
    state: 'RS',
    city: 'Passo Fundo',
    totalArea: 800,
    cultivableArea: 600,
    vegetationArea: 200,
    producerId: 2,
  } as Farm,

  // Fazendas do Vale Ltda (5 fazendas)
  {
    id: 6,
    name: 'Fazenda Grande',
    state: 'MT',
    city: 'Sorriso',
    totalArea: 5000,
    cultivableArea: 4000,
    vegetationArea: 1000,
    producerId: 3,
  } as Farm,
  {
    id: 7,
    name: 'Fazenda Progresso',
    state: 'MS',
    city: 'Dourados',
    totalArea: 3000,
    cultivableArea: 2200,
    vegetationArea: 800,
    producerId: 3,
  } as Farm,
  {
    id: 8,
    name: 'Fazenda Nova Era',
    state: 'BA',
    city: 'Barreiras',
    totalArea: 1800,
    cultivableArea: 1200,
    vegetationArea: 600,
    producerId: 3,
  } as Farm,
  {
    id: 9,
    name: 'Fazenda Sol Nascente',
    state: 'GO',
    city: 'Jataí',
    totalArea: 2500,
    cultivableArea: 1800,
    vegetationArea: 700,
    producerId: 3,
  } as Farm,
  {
    id: 10,
    name: 'Fazenda Paraíso',
    state: 'SP',
    city: 'Presidente Prudente',
    totalArea: 900,
    cultivableArea: 650,
    vegetationArea: 250,
    producerId: 3,
  } as Farm,

  // Agropecuária Nordeste (3 fazendas)
  {
    id: 11,
    name: 'Fazenda Nordestina',
    state: 'BA',
    city: 'Juazeiro',
    totalArea: 1500,
    cultivableArea: 1000,
    vegetationArea: 500,
    producerId: 4,
  } as Farm,
  {
    id: 12,
    name: 'Sítio Cachoeira',
    state: 'PE',
    city: 'Petrolina',
    totalArea: 400,
    cultivableArea: 280,
    vegetationArea: 120,
    producerId: 4,
  } as Farm,
  {
    id: 13,
    name: 'Fazenda São Francisco',
    state: 'PI',
    city: 'Bom Jesus',
    totalArea: 1100,
    cultivableArea: 750,
    vegetationArea: 350,
    producerId: 4,
  } as Farm,

  // Carlos Oliveira (4 fazendas)
  {
    id: 14,
    name: 'Fazenda Oliveira',
    state: 'SC',
    city: 'Chapecó',
    totalArea: 700,
    cultivableArea: 500,
    vegetationArea: 200,
    producerId: 5,
  } as Farm,
  {
    id: 15,
    name: 'Chácara Feliz',
    state: 'PR',
    city: 'Maringá',
    totalArea: 300,
    cultivableArea: 200,
    vegetationArea: 100,
    producerId: 5,
  } as Farm,
  {
    id: 16,
    name: 'Fazenda Boa Esperança',
    state: 'RS',
    city: 'Santa Maria',
    totalArea: 950,
    cultivableArea: 700,
    vegetationArea: 250,
    producerId: 5,
  } as Farm,
  {
    id: 17,
    name: 'Sítio Recanto',
    state: 'SC',
    city: 'Concórdia',
    totalArea: 450,
    cultivableArea: 320,
    vegetationArea: 130,
    producerId: 5,
  } as Farm,
];

// Variedades de alimentos
const alimentos = [
  'Soja', 'Milho', 'Café', 'Cana-de-açúcar', 'Algodão', 
  'Arroz', 'Feijão', 'Trigo', 'Laranja', 'Uva',
  'Tomate', 'Batata', 'Cenoura', 'Cebola', 'Mandioca'
];

// Safras (3 por ano, múltiplas culturas por fazenda)
const currentYear = new Date().getFullYear();
export const crops: Crop[] = [];

let cropId = 1;

// Gerar safras para cada fazenda
farms.forEach(farm => {
  // 3 safras por ano (plantio de verão, inverno e safrinha)
  const safras = [
    { ano: currentYear - 1 },
    { ano: currentYear - 1,},
    { ano: currentYear },
    { ano: currentYear },
  ];

  safras.forEach(safra => {
    // Cada safra pode ter 1-3 culturas diferentes
    const numCulturas = Math.floor(Math.random() * 3) + 1;
    const culturasSelecionadas = [...alimentos]
      .sort(() => 0.5 - Math.random())
      .slice(0, numCulturas);

    culturasSelecionadas.forEach(alimento => {
      crops.push({
        id: cropId++,
        year: safra.ano,
        food: alimento,
        farmId: farm.id,
      } as Crop);
    });
  });
});

// Produtos individuais para referência
export const sampleProducer: Producer = producers[0];
export const sampleFarm: Farm = farms[0];
export const sampleCrop: Crop = crops[0];

export default { producers, farms, crops, sampleProducer, sampleFarm, sampleCrop };