import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return Dia do Trabalhador for 01-05', async () => {
    const response = await request(app.getHttpServer())
      .get('/feriados/1600501/2020-05-01/')
      .expect(200);

    expect(response.body.name).toBe('Dia do Trabalhador');

    const response2 = await request(app.getHttpServer())
      .get('/feriados/4305439/2020-05-01/')
      .expect(200);

    expect(response2.body.name).toBe('Dia do Trabalhador');
  });

  it('should not allow deletion of national holidays', async () => {
    await request(app.getHttpServer())
      .del('/feriados/4305439/05-01/')
      .expect(403);
  });

  it('should handle Consciência Negra holiday in Rio de Janeiro', async () => {
    const payload = { name: 'Consciência Negra' };

    await request(app.getHttpServer())
      .put('/feriados/33/11-20/')
      .send(payload)
      .expect((res) => [200, 201].includes(res.status));

    const stateResponse = await request(app.getHttpServer())
      .get('/feriados/33/2020-11-20/')
      .expect(200);

    expect(stateResponse.body.name).toBe('Consciência Negra');

    const capitalResponse = await request(app.getHttpServer())
      .get('/feriados/3304557/2020-11-20/')
      .expect(200);

    expect(capitalResponse.body.name).toBe('Consciência Negra');

    await request(app.getHttpServer())
      .del('/feriados/3304557/11-20/')
      .expect(403);

    await request(app.getHttpServer()).del('/feriados/33/11-20/').expect(204);
  });

  it('should return Sexta-Feira Santa for a given date', async () => {
    const response = await request(app.getHttpServer())
      .get('/feriados/2111300/2020-04-10/')
      .expect(200);

    expect(response.body.name).toBe('Sexta-Feira Santa');
  });

  it('should handle Corpus Christi in Ouro Preto', async () => {
    await request(app.getHttpServer())
      .put('/feriados/3146107/corpus-christi/')
      .expect((res) => [200, 201].includes(res.status));

    const response2020 = await request(app.getHttpServer())
      .get('/feriados/3146107/2020-06-11/')
      .expect(200);

    expect(response2020.body.name).toBe('Corpus Christi');

    const response2021 = await request(app.getHttpServer())
      .get('/feriados/3146107/2021-06-03/')
      .expect(200);

    expect(response2021.body.name).toBe('Corpus Christi');
  });
});
