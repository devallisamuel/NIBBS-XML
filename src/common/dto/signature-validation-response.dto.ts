import { ApiProperty } from '@nestjs/swagger';

export class SignatureValidationResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the XML signature validated successfully.',
  })
  isValid!: boolean;

  @ApiProperty({
    example: 'local',
    description: 'The public key source used during validation.',
  })
  keySource!: string;

  @ApiProperty({
    example: [],
    type: [String],
    description: 'Collected validation errors, if any.',
  })
  errors!: string[];

  @ApiProperty({
    example:
      '/path/to/project/debug-output/signature-verification/sample.xml',
    required: false,
    description:
      'Optional persisted XML path when artifact persistence is enabled.',
  })
  persistedArtifactPath?: string;
}
