import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PublicKeySource } from '../../services/key-material.service';

export class SignatureValidationRequestDto {
  @ApiProperty({
    example: '<?xml version="1.0" encoding="UTF-8"?><Document>...</Document>',
  })
  @IsString()
  xml!: string;

  @ApiProperty({
    enum: ['local', 'counterparty'],
    example: 'local',
    required: false,
  })
  @IsOptional()
  @IsIn(['local', 'counterparty'])
  keySource?: PublicKeySource;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  persistArtifacts?: boolean;

  @ApiProperty({ example: 'sample-signature-check', required: false })
  @IsOptional()
  @IsString()
  artifactLabel?: string;
}
