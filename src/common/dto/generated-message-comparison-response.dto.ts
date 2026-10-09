import { ApiProperty } from '@nestjs/swagger';
import { ArtifactComparisonDto } from './artifact-comparison.dto';
import { GeneratedMessageResponseDto } from './generated-message-response.dto';

export class GeneratedMessageComparisonResponseDto {
  @ApiProperty({
    type: GeneratedMessageResponseDto,
    description: 'Artifacts from the first generation run.',
  })
  bridge!: GeneratedMessageResponseDto;

  @ApiProperty({
    type: GeneratedMessageResponseDto,
    description: 'Artifacts from the second generation run.',
  })
  native!: GeneratedMessageResponseDto;

  @ApiProperty({
    type: ArtifactComparisonDto,
    description: 'Byte/content comparison for the plain XML artifacts.',
  })
  plainXml!: ArtifactComparisonDto;

  @ApiProperty({
    type: ArtifactComparisonDto,
    description: 'Byte/content comparison for the signed XML artifacts.',
  })
  signedXml!: ArtifactComparisonDto;

  @ApiProperty({
    type: ArtifactComparisonDto,
    description:
      'Byte/content comparison for the signed-and-encrypted XML artifacts.',
  })
  signedEncryptedXml!: ArtifactComparisonDto;
}
