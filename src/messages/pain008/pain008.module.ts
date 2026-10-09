import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pain008Controller } from './pain008.controller';
import { Pain008NativeService } from './pain008-native.service';
import { Pain008Service } from './pain008.service';

@Module({
  imports: [CommonModule],
  controllers: [Pain008Controller],
  providers: [Pain008Service, Pain008NativeService],
})
export class Pain008Module {}
