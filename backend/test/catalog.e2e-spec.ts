import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Catalog (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should get all products', async () => {
    const response = await request(app.getHttpServer()).get('/catalog');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(35);
    expect(response.body[0].store).toHaveProperty('id');
  });

  it('should get products for a search query', async () => {
    const response = await request(app.getHttpServer())
      .get('/catalog')
      .query({ q: 'Arroz' }); 
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Arroz'); 
  });
});
