import { ApiProperty } from '@nestjs/swagger';
import { GeneratedArtifactDto } from '../../../common/dto/generated-artifact.dto';

export class NativeGeneratedMessageResponseDto {
  @ApiProperty({ example: '00000020260617213015999999999999999' })
  messageId!: string;

  @ApiProperty({ example: 'acmt023' })
  messageType!: string;

  @ApiProperty({ type: GeneratedArtifactDto })
  plainXml!: GeneratedArtifactDto;

  @ApiProperty({ type: GeneratedArtifactDto })
  signedXml!: GeneratedArtifactDto;

  @ApiProperty({ type: GeneratedArtifactDto })
  signedEncryptedXml!: GeneratedArtifactDto;
}
