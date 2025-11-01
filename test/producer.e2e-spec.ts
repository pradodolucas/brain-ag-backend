import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from '../src/producer/entities/producer.entity';
import { Farm } from '../src/farm/entities/farm.entity';
import { Crop } from '../src/crop/entities/crop.entity';
import { ProducerModule } from '../src/producer/producer.module';

describe('Produtor (e2e) - sqlite em memória', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: ':memory:',
					entities: [Producer, Farm, Crop],
					synchronize: true,
					// avoid logging noise during tests
					logging: false,
				}),
				ProducerModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('deve criar um produtor e depois recuperá-lo', async () => {
		const createRes = await request(app.getHttpServer())
			.post('/producer')
			.send({ name: 'E2E Producer', taxId: '00099988877766' })
			.expect(201);

		const id = createRes.body.id;

		const getRes = await request(app.getHttpServer()).get(`/producer/${id}`).expect(200);

		expect(getRes.body).toHaveProperty('id', id);
		expect(getRes.body.name).toBe('E2E Producer');
		expect(getRes.body.taxId).toBe('00099988877766');
	});
});