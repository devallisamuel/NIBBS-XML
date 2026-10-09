import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pain011Controller } from './pain011.controller';
import { Pain011NativeService } from './pain011-native.service';
import { Pain011Service } from './pain011.service';

@Module({
  imports: [CommonModule],
  controllers: [Pain011Controller],
  providers: [Pain011Service, Pain011NativeService],
})
export class Pain011Module {}
