import {
  Controller,
  Post,
  Body,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ShortlinkService } from './shortlink.service'; // Import the interface here
import { Response } from 'express';

@Controller('shortlink')
export class ShortlinkController {
  constructor(private readonly shortlinkService: ShortlinkService) {}

  @Post('encode')
  encode(@Body('url') longUrl: string) {
    const shortUrl = this.shortlinkService.encode(longUrl);
    return { shortUrl };
  }

  @Post('decode')
  decode(@Body('url') shortUrl: string, @Res() res: Response) {
    const longUrl = this.shortlinkService.decode(shortUrl);
    if (longUrl) {
      return res.redirect(longUrl);
    } else {
      throw new NotFoundException('Short URL not found');
    }
  }
}
