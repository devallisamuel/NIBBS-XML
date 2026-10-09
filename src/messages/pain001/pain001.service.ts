import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { PaymentInitiationRequestDto } from './dto/payment-initiation-request.dto';
import { Pain001NativeService } from './pain001-native.service';

@Injectable()
export class Pain001Service {
  constructor(
    private readonly pain001NativeService: Pain001NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: PaymentInitiationRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: PaymentInitiationRequestDto) {
    return this.pain001NativeService.generate(request);
  }

  async generateCompare(
    request: PaymentInitiationRequestDto,
  ): Promise<GeneratedMessageComparisonResponseDto> {
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
