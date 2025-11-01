import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';

import mocks from '../src/mocks/mock-data';
import { Producer } from '../src/producer/entities/producer.entity';
import { Farm } from '../src/farm/entities/farm.entity';
import { Crop } from '../src/crop/entities/crop.entity';

async function createDataSource() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'farm_db',
    entities: [Producer, Farm, Crop],
    // Em ambiente de desenvolvimento, sincronizamos o schema para criar tabelas automaticamente.
    // NÃO habilitar em produção.
    synchronize: true,
    logging: false,
  });

  return dataSource;
}

async function run() {
  const ds = await createDataSource();

  try {
    console.log('Inicializando conexão com o banco...');
    await ds.initialize();

    const producerRepo = ds.getRepository(Producer);
    const farmRepo = ds.getRepository(Farm);
    const cropRepo = ds.getRepository(Crop);

      console.log('Inserindo/atualizando dados mock (não será feita limpeza das tabelas).');

    console.log('Inserindo produtores...');
    for (const p of mocks.producers) {
      // salvar como any para evitar mismatch de campos opcionais
      await producerRepo.save(p as any);
    }

    console.log('Inserindo fazendas...');
    for (const f of mocks.farms) {
      // recuperar produtor salvo
      const prod = await producerRepo.findOneBy({ id: (f as any).producerId });
      const farmToSave: any = { ...f, producer: prod };
      await farmRepo.save(farmToSave);
    }

    console.log('Inserindo culturas...');
    for (const c of mocks.crops) {
      const farm = await farmRepo.findOneBy({ id: (c as any).farmId });
      if (!farm) continue;
      const cropToSave: any = { ...c, farm };
      await cropRepo.save(cropToSave);
    }

    console.log('Seed finalizado com sucesso.');
  } catch (err) {
    console.error('Erro durante seed:', err);
    process.exitCode = 1;
  } finally {
    if (ds.isInitialized) await ds.destroy();
  }
}

run();
