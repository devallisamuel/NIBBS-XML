import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { MandateInitiationRequestDto } from './dto/mandate-initiation-request.dto';
import { Pain009NativeService } from './pain009-native.service';

@Injectable()
export class Pain009Service {
  constructor(
    private readonly pain009NativeService: Pain009NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: MandateInitiationRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: MandateInitiationRequestDto) {
    return this.pain009NativeService.generate(request);
  }

  async generateCompare(
    request: MandateInitiationRequestDto,
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
