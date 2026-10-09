import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { MandateAmendmentRequestDto } from './dto/mandate-amendment-request.dto';
import { Pain010NativeService } from './pain010-native.service';

@Injectable()
export class Pain010Service {
  constructor(
    private readonly pain010NativeService: Pain010NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: MandateAmendmentRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: MandateAmendmentRequestDto) {
    return this.pain010NativeService.generate(request);
  }

  async generateCompare(
    request: MandateAmendmentRequestDto,
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
