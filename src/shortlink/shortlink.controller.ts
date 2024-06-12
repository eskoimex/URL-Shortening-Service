import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ShortlinkService, URLMapping } from './shortlink.service'; // I imported the interface here
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

  @Get('statistic/:urlPath')
  getStatistics(@Param('urlPath') urlPath: string): URLMapping {
    // I used the imported interface here
    const stats = this.shortlinkService.getStatistics(urlPath);
    if (stats) {
      return stats;
    } else {
      throw new NotFoundException('Short URL not found');
    }
  }
}
