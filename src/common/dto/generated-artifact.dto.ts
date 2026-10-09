import { ApiProperty } from '@nestjs/swagger';

export class GeneratedArtifactDto {
  @ApiProperty({
    example:
      '/path/to/project/debug-output/pain009/01-plain-pain009-20260617_120653.xml',
    description: 'Absolute path to the persisted XML artifact on disk.',
  })
  path!: string;

  @ApiProperty({
    example: '<?xml version="1.0" encoding="UTF-8"?><Document>...</Document>',
    description: 'Full XML payload for the generated artifact.',
  })
  content!: string;
}
