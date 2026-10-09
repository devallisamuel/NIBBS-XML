import { Module } from '@nestjs/common';
import { Acmt023Module } from './messages/acmt023/acmt023.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { CryptoDiagnosticsModule } from './common/diagnostics/crypto-diagnostics.module';
import { Pain001Module } from './messages/pain001/pain001.module';
import { Pain008Module } from './messages/pain008/pain008.module';
import { Pain009Module } from './messages/pain009/pain009.module';
import { Pain010Module } from './messages/pain010/pain010.module';
import { Pain011Module } from './messages/pain011/pain011.module';
import { Pacs008Module } from './messages/pacs008/pacs008.module';

@Module({
  imports: [
    CommonModule,
    CryptoDiagnosticsModule,
    Acmt023Module,
    Pain001Module,
    Pain008Module,
    Pain009Module,
    Pain010Module,
    Pain011Module,
    Pacs008Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
