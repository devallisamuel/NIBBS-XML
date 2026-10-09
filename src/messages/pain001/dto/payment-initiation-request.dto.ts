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

export class PaymentInitiationRequestDto {
  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  initiatingPartyName!: string;

  @ApiProperty({
    example: '000000',
    description: 'Institution code used in <Cd> for the initiating party.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  schemeCode!: string;

  @ApiProperty({
    example: '000000',
    required: false,
    description: 'Optional forwarding agent/member identifier.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/)
  forwardingAgentBic?: string;

  @ApiProperty({
    example: 'PMT-20251016-001-SINGLE',
    required: false,
    description:
      'Optional payment information identifier. Auto-generated if omitted.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(35)
  paymentInformationId?: string;

  @ApiProperty({ example: false })
  @Type(() => Boolean)
  @IsBoolean()
  batchBooking!: boolean;

  @ApiProperty({ example: '2026-02-17Z' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}Z?$/)
  requestedExecutionDate!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  debtorName!: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @Matches(/^\d{10}$/)
  debtorAccountNumber!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  debtorAccountName!: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  debtorAgentBic!: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  debtorAgentMemberId!: string;

  @ApiProperty({ example: 'SLEV' })
  @IsString()
  @IsNotEmpty()
  chargeBearerType!: string;

  @ApiProperty({
    example: '99905746102951471838787625821100514',
    required: false,
    description:
      'Optional 35-digit numeric end-to-end id. Auto-generated if omitted.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{35}$/)
  @MaxLength(35)
  endToEndId?: string;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  currencyCode!: string;

  @ApiProperty({ example: '1500.00' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  amount!: string;

  @ApiProperty({ example: '999997' })
  @IsString()
  @Matches(/^\d{6}$/)
  creditorAgentBic!: string;

  @ApiProperty({ example: '999997' })
  @IsString()
  @Matches(/^\d{6}$/)
  creditorAgentMemberId!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  creditorName!: string;

  @ApiProperty({ example: '3157417712' })
  @IsString()
  @Matches(/^\d{10}$/)
  creditorAccountNumber!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  creditorAccountName!: string;

  @ApiProperty({
    example: 'Invoice settlement test',
    required: false,
    description:
      'Optional remittance information, max 140 chars by convention.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  remittanceInformation?: string;

  @ApiProperty({ example: '2' })
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

  @ApiProperty({ example: '013223231333' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  transactionLocation!: string;

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  channelCode!: string;

  @ApiProperty({ example: false })
  @Type(() => Boolean)
  @IsBoolean()
  fixedCollectionAmount!: boolean;

  @ApiProperty({
    example: '0000004/001/0000070986',
    required: false,
    description: 'Optional mandate reference code.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9/]+$/)
  mandateCode?: string;
}
