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
}
