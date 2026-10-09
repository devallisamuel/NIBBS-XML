import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class DirectDebitInitiationRequestDto {
  @ApiProperty({ example: 'ACME BILLING LIMITED' })
  @IsString()
  @IsNotEmpty()
  initiatingPartyName!: string;

  @ApiProperty({ example: 'FWDGAGT', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  forwardingAgentBic?: string;

  @ApiProperty({ example: '026-071-67895-001-00022', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(35)
  paymentInformationId?: string;

  @ApiProperty({ example: 'NURG' })
  @IsString()
  @IsNotEmpty()
  serviceLevelCode!: string;

  @ApiProperty({ example: 'NPSDD' })
  @IsString()
  @IsNotEmpty()
  localInstrumentCode!: string;

  @ApiProperty({ example: 'FRST' })
  @IsString()
  @IsNotEmpty()
  sequenceType!: string;

  @ApiProperty({ example: '2025-02-16Z' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}Z?$/)
  requestedCollectionDate!: string;

  @ApiProperty({ example: 'ACME BILLING LIMITED' })
  @IsString()
  @IsNotEmpty()
  creditorName!: string;

  @ApiProperty({ example: '3157417712' })
  @IsString()
  @Matches(/^\d{10}$/)
  creditorAccountNumber!: string;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  currencyCode!: string;

  @ApiProperty({ example: 'AA123456' })
  @IsString()
  @IsNotEmpty()
  creditorAgentBic!: string;

  @ApiProperty({ example: '999058' })
  @IsString()
  @Matches(/^\d{6}$/)
  creditorAgentMemberId!: string;

  @ApiProperty({ example: 'DD-INSTR-0001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(35)
  instructionId?: string;

  @ApiProperty({
    example: '99905746102951471838787625821100514',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{35}$|^.{1,35}$/)
  @MaxLength(35)
  endToEndId?: string;

  @ApiProperty({ example: '100.00' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  amount!: string;

  @ApiProperty({ example: '0000004/001/0000070986' })
  @IsString()
  @IsNotEmpty()
  mandateId!: string;

  @ApiProperty({ example: '2025-02-01Z' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}Z?$/)
  dateOfSignature!: string;

  @ApiProperty({ example: '2025-02-16Z', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}Z?$/)
  firstCollectionDate?: string;

  @ApiProperty({ example: '2025-12-31Z', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}Z?$/)
  finalCollectionDate?: string;

  @ApiProperty({ example: 'MNTH', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  frequencyType?: string;

  @ApiProperty({ example: '999057' })
  @IsString()
  @Matches(/^\d{6}$/)
  debtorAgentMemberId!: string;

  @ApiProperty({ example: 'JOHN DOE' })
  @IsString()
  @IsNotEmpty()
  debtorName!: string;

  @ApiProperty({ example: '0177136558' })
  @IsString()
  @Matches(/^\d{10}$/)
  debtorAccountNumber!: string;

  @ApiProperty({ example: '0177136558', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  otherAccountIdentifier?: string;

  @ApiProperty({ example: 'UTILITY BILL FEB-2025', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  remittanceInformation?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  debtorAccountDesignation!: string;

  @ApiProperty({ example: 'BVN' })
  @IsString()
  @IsNotEmpty()
  debtorIdType!: string;

  @ApiProperty({ example: '22222222222' })
  @IsString()
  @IsNotEmpty()
  debtorIdValue!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  debtorAccountTier!: string;

  @ApiProperty({ example: '', required: false, description: 'Empty string generates <BiometricData/>' })
  @IsOptional()
  @IsString()
  debtorBiometricData?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  creditorAccountDesignation!: string;

  @ApiProperty({ example: 'BVN' })
  @IsString()
  @IsNotEmpty()
  creditorIdType!: string;

  @ApiProperty({ example: '22222222222' })
  @IsString()
  @IsNotEmpty()
  creditorIdValue!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  creditorAccountTier!: string;

  @ApiProperty({ example: '013223231333' })
  @IsString()
  @Matches(/^\d+$/)
  transactionLocation!: string;

  @ApiProperty({ example: '99905820251104552022522202020202015' })
  @IsString()
  @IsNotEmpty()
  nameEnquiryMessageId!: string;

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  channelCode!: string;

  @ApiProperty({ example: false })
  @Type(() => Boolean)
  @IsBoolean()
  fixedCollectionAmount!: boolean;

  @ApiProperty({ example: '0000004/001/0000070986', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mandateCode?: string;
}
