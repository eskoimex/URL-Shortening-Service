import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ShortlinkService } from './shortlink.service'; // Import the interface here

@Controller('shortlink')
export class ShortlinkController {
  constructor(private readonly shortlinkService: ShortlinkService) {}

  @Post('encode')
  encode(@Body('url') longUrl: string) {
    const shortUrl = this.shortlinkService.encode(longUrl);
    return { shortUrl };
  }

}
