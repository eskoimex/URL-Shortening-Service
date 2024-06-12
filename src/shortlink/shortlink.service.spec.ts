import { Test, TestingModule } from '@nestjs/testing';
import { ShortlinkService } from './shortlink.service';

describe('ShortlinkService', () => {
  let service: ShortlinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortlinkService],
    }).compile();

    service = module.get<ShortlinkService>(ShortlinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encode a URL to a short URL', () => {
    const longUrl = 'https://indicina.co';
    const shortUrl = service.encode(longUrl);

    expect(shortUrl).toMatch(/^http:\/\/short\.est\/\w{6}$/);

    const urlHash = shortUrl.replace('http://short.est/', '');
    const storedUrl = service.getStatistics(urlHash);

    expect(storedUrl).toBeDefined();
    expect(storedUrl.longUrl).toBe(longUrl);
    expect(storedUrl.shortUrl).toBe(shortUrl);
    expect(storedUrl.visits).toBe(0);
  });

  it('should decode a short URL to the original URL', () => {
    const longUrl = 'https://indicina.co';
    const shortUrl = service.encode(longUrl);
    const decodedUrl = service.decode(shortUrl);

    expect(decodedUrl).toBe(longUrl);

    const urlHash = shortUrl.replace('http://short.est/', '');
    const storedUrl = service.getStatistics(urlHash);

    expect(storedUrl.visits).toBe(1); // Visits should increase
  });

  it('should return null for a non-existent short URL', () => {
    const shortUrl = 'http://short.est/nonExistent';
    const decodedUrl = service.decode(shortUrl);

    expect(decodedUrl).toBeNull();
  });

  it('should return statistics for a valid short URL path', () => {
    const longUrl = 'https://indicina.co';
    const shortUrl = service.encode(longUrl);
    const urlHash = shortUrl.replace('http://short.est/', '');
    const stats = service.getStatistics(urlHash);

    expect(stats).toBeDefined();
    expect(stats.longUrl).toBe(longUrl);
    expect(stats.shortUrl).toBe(shortUrl);
    expect(stats.visits).toBe(0);
    expect(stats.createdAt).toBeInstanceOf(Date);
  });

  it('should return null statistics for a non-existent short URL path', () => {
    const stats = service.getStatistics('nonExistent');

    expect(stats).toBeNull();
  });
});
