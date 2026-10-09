import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pain009Controller } from './pain009.controller';
import { Pain009NativeService } from './pain009-native.service';
import { Pain009Service } from './pain009.service';

@Module({
  imports: [CommonModule],
  controllers: [Pain009Controller],
  providers: [Pain009Service, Pain009NativeService],
})
export class Pain009Module {}
