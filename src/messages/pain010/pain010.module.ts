import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pain010Controller } from './pain010.controller';
import { Pain010NativeService } from './pain010-native.service';
import { Pain010Service } from './pain010.service';

@Module({
  imports: [CommonModule],
  controllers: [Pain010Controller],
  providers: [Pain010Service, Pain010NativeService],
})
export class Pain010Module {}
