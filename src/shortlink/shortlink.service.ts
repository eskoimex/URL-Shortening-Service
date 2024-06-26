import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface URLMapping {
  // Exported the interface here
  longUrl: string;
  shortUrl: string;
  visits: number;
  createdAt: Date;
}

@Injectable()
export class ShortlinkService {
  private urlStore: Map<string, URLMapping> = new Map();
  private baseUrl: string = 'http://short.est/';

  /**
   * Encodes a URL to a shortened URL.
   * @param longUrl - The encode argument contains a longUrl.
   * @returns A String containing the shortUrl.
   */
  encode(longUrl: string): string {
    const urlHash = crypto
      .createHash('md5')
      .update(longUrl)
      .digest('base64')
      .slice(0, 6);
    const shortUrl = this.baseUrl + urlHash;
    this.urlStore.set(urlHash, {
      longUrl,
      shortUrl,
      visits: 0,
      createdAt: new Date(),
    });
    return shortUrl;
  }

  /**
   * Decodes a shortened URL to its original URL.
   * @param shortUrl - The decode argument contains a shortUrl.
   * @returns A String containing the longUrl.
   * @returns null if longUrl does not exist in store.
   * @throws NotFoundException - If shortUrl is not found.
   */
  decode(shortUrl: string): string | null {
    const urlHash = shortUrl.replace(this.baseUrl, '');
    const urlMapping = this.urlStore.get(urlHash);
    if (urlMapping) {
      urlMapping.visits += 1;
      return urlMapping.longUrl;
    }
    return null;
  }

  /**
   * Return basic stat of a short URL path.
   * @param urlPath - The getStatistics argument contains a urlPath.
   * @returns A Json containing the stat in the store.
   * @returns null if stat does not exist in store.
   * @throws NotFoundException - If shortUrl is not found.
   */
  getStatistics(urlPath: string): URLMapping | null {
    return this.urlStore.get(urlPath) || null;
  }
}
