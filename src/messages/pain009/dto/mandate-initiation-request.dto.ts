import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class MandateInitiationRequestDto {
  @ApiProperty({ example: 'MND-000000-999997-007' })
  @IsString()
  @IsNotEmpty()
  mandateId!: string;

  @ApiProperty({ example: 'OOFF' })
  @IsString()
  @IsNotEmpty()
  sequenceType!: string;

  @ApiProperty({ example: 'MNTH' })
  @IsString()
  @IsNotEmpty()
  frequencyType!: string;

  @ApiProperty({ example: '2026-06-20' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  firstCollectionDate!: string;

  @ApiProperty({ example: '2026-12-20' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  finalCollectionDate!: string;

  @ApiProperty({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  trackingIndicator!: boolean;

  @ApiProperty({ example: '1000.00' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  collectionAmount!: string;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  collectionCurrency!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  creditorName!: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @Matches(/^\d{10}$/)
  creditorAccountNumber!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  creditorAccountName!: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  creditorAgentBIC!: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  creditorAgentMemberId!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  debtorName!: string;

  @ApiProperty({ example: '3157417712' })
  @IsString()
  @Matches(/^\d{10}$/)
  debtorAccountNumber!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  debtorAccountName!: string;

  @ApiProperty({ example: '999997' })
  @IsString()
  @Matches(/^\d{6}$/)
  debtorAgentBIC!: string;

  @ApiProperty({ example: '999997' })
  @IsString()
  @Matches(/^\d{6}$/)
  debtorAgentMemberId!: string;

  @ApiProperty({ example: 'MSIN' })
  @IsString()
  @IsNotEmpty()
  documentTypeCode!: string;

  @ApiProperty({ example: 'DOC-000000-007' })
  @IsString()
  @IsNotEmpty()
  documentNumber!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  debtorAccountDesignation!: string;

  @ApiProperty({ example: 'BVN' })
  @IsString()
  @IsNotEmpty()
  debtorIdType!: string;

  @ApiProperty({ example: '11111111145' })
  @IsString()
  @IsNotEmpty()
  debtorIdValue!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  debtorAccountTier!: string;

  @ApiProperty({ example: 'N/A' })
  @IsString()
  @IsNotEmpty()
  debtorBiometricData!: string;

  @ApiProperty({ example: 'Lagos Nigeria' })
  @IsString()
  @IsNotEmpty()
  debtorAddressLine!: string;

  @ApiProperty({ example: '08012345678' })
  @IsString()
  @IsNotEmpty()
  debtorPhoneNumber!: string;

  @ApiProperty({ example: 'ponmile.joy@example.com' })
  @IsEmail()
  debtorEmailAddress!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  creditorAccountDesignation!: string;

  @ApiProperty({ example: 'BVN' })
  @IsString()
  @IsNotEmpty()
  creditorIdType!: string;

  @ApiProperty({ example: '11111111145' })
  @IsString()
  @IsNotEmpty()
  creditorIdValue!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  creditorAccountTier!: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  transactionLocation!: string;

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  channelCode!: string;

  @ApiProperty({ example: '0' })
  @IsString()
  @IsNotEmpty()
  mandateCategory!: string;

  @ApiProperty({ example: false })
  @Type(() => Boolean)
  @IsBoolean()
  fixedCollectionAmount!: boolean;
}
