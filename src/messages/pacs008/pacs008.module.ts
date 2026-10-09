import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pacs008Controller } from './pacs008.controller';
import { Pacs008NativeService } from './pacs008-native.service';
import { Pacs008Service } from './pacs008.service';

@Module({
  imports: [CommonModule],
  controllers: [Pacs008Controller],
  providers: [Pacs008Service, Pacs008NativeService],
})
export class Pacs008Module {}
