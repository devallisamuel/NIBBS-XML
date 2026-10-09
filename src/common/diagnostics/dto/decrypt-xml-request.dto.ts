import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PublicKeySource } from '../../services/key-material.service';

export class DecryptXmlRequestDto {
  @ApiProperty({
    example: '<?xml version="1.0" encoding="UTF-8"?><Document>...</Document>',
  })
  @IsString()
  xml!: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  validateSignatureAfterDecrypt?: boolean;

  @ApiProperty({
    enum: ['local', 'counterparty'],
    example: 'local',
    required: false,
  })
  @IsOptional()
  @IsIn(['local', 'counterparty'])
  signatureKeySource?: PublicKeySource;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  persistArtifacts?: boolean;

  @ApiProperty({ example: 'sample-decrypt', required: false })
  @IsOptional()
  @IsString()
  artifactLabel?: string;
}
