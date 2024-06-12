import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ShortlinkService } from './shortlink.service';

describe('ShortlinkController (e2e)', () => {
  let app: INestApplication;
  let shortlinkService: ShortlinkService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    shortlinkService = moduleFixture.get<ShortlinkService>(ShortlinkService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/shortlink/encode (POST) should encode a URL', async () => {
    const longUrl = 'https://indicina.co';
    const response = await request(app.getHttpServer())
      .post('/shortlink/encode')
      .send({ url: longUrl })
      .expect(201);

    expect(response.body).toHaveProperty('shortUrl');
    const shortUrl = response.body.shortUrl;
    expect(shortUrl).toMatch(/^http:\/\/short\.est\/\w+$/);

    // Verify the URL was stored correctly
    const urlHash = shortUrl.replace('http://short.est/', '');
    const storedUrl = shortlinkService.getStatistics(urlHash);
    expect(storedUrl.longUrl).toBe(longUrl);
  });

  it('/shortlink/decode (POST) should decode a short URL', async () => {
    const longUrl = 'https://indicina.co';
    const shortUrl = shortlinkService.encode(longUrl);

    await request(app.getHttpServer())
      .post('/shortlink/decode')
      .send({ url: shortUrl })
      .expect(302)
      .expect('Location', longUrl);
  });

  it('/shortlink/statistic/:urlPath (GET) should return URL statistics', async () => {
    const longUrl = 'https://indicina.co';
    const shortUrl = shortlinkService.encode(longUrl);
    const urlHash = shortUrl.replace('http://short.est/', '');

    const response = await request(app.getHttpServer())
      .get(`/shortlink/statistic/${urlHash}`)
      .expect(200);

    expect(response.body).toHaveProperty('longUrl', longUrl);
    expect(response.body).toHaveProperty('shortUrl', shortUrl);
    expect(response.body).toHaveProperty('visits', 0);
    expect(response.body).toHaveProperty('createdAt');
  });

  it('/shortlink/statistic/:urlPath (GET) should return 404 for non-existent URL', async () => {
    await request(app.getHttpServer())
      .get(`/shortlink/statistic/nonExistent`)
      .expect(404);
  });
});
