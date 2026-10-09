import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { MandateCancellationRequestDto } from './dto/mandate-cancellation-request.dto';
import { Pain011NativeService } from './pain011-native.service';

@Injectable()
export class Pain011Service {
  constructor(
    private readonly pain011NativeService: Pain011NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: MandateCancellationRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: MandateCancellationRequestDto) {
    return this.pain011NativeService.generate(request);
  }

  async generateCompare(
    request: MandateCancellationRequestDto,
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
