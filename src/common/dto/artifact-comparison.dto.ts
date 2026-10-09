import { ApiProperty } from '@nestjs/swagger';

export class ArtifactComparisonDto {
  @ApiProperty({
    example: false,
    description: 'Whether the two compared artifact payloads matched exactly.',
  })
  matches!: boolean;

  @ApiProperty({
    example:
      '- <CreDtTm>2026-06-17T12:06:53.309159+01:00</CreDtTm>\n+ <CreDtTm>2026-06-17T21:35:53.309000+01:00</CreDtTm>',
    required: false,
    description:
      'Short line diff preview to help isolate the first visible differences.',
  })
  diffPreview?: string;
}
