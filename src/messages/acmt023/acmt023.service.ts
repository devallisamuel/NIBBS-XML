import { Injectable } from '@nestjs/common';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { XmlComparisonService } from '../../common/services/xml-comparison.service';
import { Acmt023NativeService } from './acmt023-native.service';
import { VerificationRequestDto } from './dto/verification-request.dto';

@Injectable()
export class Acmt023Service {
  constructor(
    private readonly acmt023NativeService: Acmt023NativeService,
    private readonly xmlComparisonService: XmlComparisonService,
  ) {}

  async generate(request: VerificationRequestDto) {
    return this.generateNative(request);
  }

  async generateNative(request: VerificationRequestDto) {
    return this.acmt023NativeService.generate(request);
  }

  async generateCompare(
    request: VerificationRequestDto,
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
