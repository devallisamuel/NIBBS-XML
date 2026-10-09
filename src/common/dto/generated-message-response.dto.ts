import { ApiProperty } from '@nestjs/swagger';
import { GeneratedArtifactDto } from './generated-artifact.dto';

export class GeneratedMessageResponseDto {
  @ApiProperty({
    example: '00000020260617120653058388024195052',
    description: 'Message identifier returned for the generated XML message.',
  })
  messageId!: string;

  @ApiProperty({
    example: 'pain009',
    description: 'Internal message type label for the generated message.',
  })
  messageType!: string;

  @ApiProperty({
    type: GeneratedArtifactDto,
    description: 'Unsigned, unencrypted XML output.',
  })
  plainXml!: GeneratedArtifactDto;

  @ApiProperty({
    type: GeneratedArtifactDto,
    description: 'Signed but unencrypted XML output.',
  })
  signedXml!: GeneratedArtifactDto;

  @ApiProperty({
    type: GeneratedArtifactDto,
    description: 'Signed and encrypted XML output.',
  })
  signedEncryptedXml!: GeneratedArtifactDto;
}
