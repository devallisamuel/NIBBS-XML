import { ApiProperty } from '@nestjs/swagger';
import { DecryptXmlResponseDto } from './decrypt-xml-response.dto';
import { SignatureValidationResponseDto } from './signature-validation-response.dto';

export class CryptoDiagnosticsResponseDto {
  @ApiProperty({
    type: SignatureValidationResponseDto,
    description:
      'Signature-validation outcome for the submitted XML or decrypted XML.',
  })
  signatureValidation!: SignatureValidationResponseDto;

  @ApiProperty({
    type: DecryptXmlResponseDto,
    required: false,
    description: 'Present when decryption was requested and completed.',
  })
  decryption?: DecryptXmlResponseDto;
}
