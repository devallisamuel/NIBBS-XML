import { ApiProperty } from '@nestjs/swagger';
import { SignatureValidationResponseDto } from './signature-validation-response.dto';

export class DecryptXmlResponseDto {
  @ApiProperty({
    example: '<?xml version="1.0" encoding="UTF-8"?><Document>...</Document>',
    description:
      'The XML reconstructed after decrypting the EncryptedData payload.',
  })
  decryptedXml!: string;

  @ApiProperty({
    example: '/path/to/project/debug-output/decryption/sample.xml',
    required: false,
    description:
      'Optional persisted XML path when artifact persistence is enabled.',
  })
  persistedArtifactPath?: string;

  @ApiProperty({
    type: SignatureValidationResponseDto,
    required: false,
    description: 'Optional signature-validation result for the decrypted XML.',
  })
  signatureValidation?: SignatureValidationResponseDto;
}
