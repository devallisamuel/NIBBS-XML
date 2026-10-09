import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { Acmt023Controller } from './acmt023.controller';
import { Acmt023NativeService } from './acmt023-native.service';
import { Acmt023Service } from './acmt023.service';

@Module({
  imports: [CommonModule],
  controllers: [Acmt023Controller],
  providers: [Acmt023Service, Acmt023NativeService],
})
export class Acmt023Module {}
