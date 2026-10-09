import { Inject, Injectable } from '@nestjs/common';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { Pacs008NativeService } from './pacs008-native.service';

@Injectable()
export class Pacs008Service {
  constructor(
    private readonly pacs008NativeService: Pacs008NativeService,
    @Inject(XmlComparisonService) private readonly xmlComparisonService: any,
  ) {}

  async generate(request: PaymentRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: PaymentRequestDto) {
    return this.pacs008NativeService.generate(request);
  }

  async generateCompare(request: PaymentRequestDto) {
    const bridge = await this.generate(request);
    const native = await this.generateNative(request);

    return {
      bridge,
      native,
      plainXml: this.xmlComparisonService.compare(
        bridge.plainXml.content,
        native.plainXml.content,
      ),
      signedXml: this.xmlComparisonService.compare(
        bridge.signedXml.content,
        native.signedXml.content,
      ),
      signedEncryptedXml: this.xmlComparisonService.compare(
        bridge.signedEncryptedXml.content,
        native.signedEncryptedXml.content,
      ),
    };
  }
}
