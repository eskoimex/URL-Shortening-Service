import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortlinkModule } from './shortlink/shortlink.module';

@Module({
  imports: [ShortlinkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
