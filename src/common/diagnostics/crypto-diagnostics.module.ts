import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { CryptoDiagnosticsController } from './crypto-diagnostics.controller';
import { CryptoDiagnosticsService } from './crypto-diagnostics.service';

@Module({
  imports: [CommonModule],
  controllers: [CryptoDiagnosticsController],
  providers: [CryptoDiagnosticsService],
})
export class CryptoDiagnosticsModule {}
