import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { DirectDebitInitiationRequestDto } from './dto/direct-debit-initiation-request.dto';
import { Pain008NativeService } from './pain008-native.service';

@Injectable()
export class Pain008Service {
  constructor(
    private readonly pain008NativeService: Pain008NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: DirectDebitInitiationRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: DirectDebitInitiationRequestDto) {
    return this.pain008NativeService.generate(request);
  }

  async generateCompare(
    request: DirectDebitInitiationRequestDto,
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
