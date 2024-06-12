import { Module } from '@nestjs/common';
import { ShortlinkService } from './shortlink.service';
import { ShortlinkController } from './shortlink.controller';

@Module({
  providers: [ShortlinkService],
  controllers: [ShortlinkController]
})
export class ShortlinkModule {}
