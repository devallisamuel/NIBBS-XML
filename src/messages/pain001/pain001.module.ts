import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Pain001Controller } from './pain001.controller';
import { Pain001NativeService } from './pain001-native.service';
import { Pain001Service } from './pain001.service';

@Module({
  imports: [CommonModule],
  controllers: [Pain001Controller],
  providers: [Pain001Service, Pain001NativeService],
})
export class Pain001Module {}
