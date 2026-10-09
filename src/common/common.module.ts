import { Module } from '@nestjs/common';
import { KeyMaterialService } from './services/key-material.service';
import { LocalDebugArtifactService } from './services/local-debug-artifact.service';
import { NativeXmlService } from './services/native-xml.service';
import { XmlComparisonService } from './services/xml-comparison.service';
import { XmlCryptoService } from './services/xml-crypto.service';

@Module({
  providers: [
    KeyMaterialService,
    LocalDebugArtifactService,
    NativeXmlService,
    XmlComparisonService,
    XmlCryptoService,
  ],
  exports: [
    KeyMaterialService,
    LocalDebugArtifactService,
    NativeXmlService,
    XmlComparisonService,
    XmlCryptoService,
  ],
})
export class CommonModule {}
