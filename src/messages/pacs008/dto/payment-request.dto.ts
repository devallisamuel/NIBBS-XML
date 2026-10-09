import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class PaymentRequestDto {
  @ApiProperty({ example: '999997' })
  @IsString()
  @Matches(/^\d{6}$/)
  instructedAgentBic!: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  instructingAgentBic!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  debtorName!: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  debtorAccountIban!: string;

  @ApiProperty({ example: 'Example Sender Institution' })
  @IsString()
  @IsNotEmpty()
  debtorAccountName!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  creditorName!: string;

  @ApiProperty({ example: '3157417712' })
  @IsString()
  @IsNotEmpty()
  creditorAccountIban!: string;

  @ApiProperty({ example: 'Ponmile Joy' })
  @IsString()
  @IsNotEmpty()
  creditorAccountName!: string;

  @ApiProperty({ example: '1500.00' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  interbankSettlementAmount!: string;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  interbankSettlementCurrency!: string;

  @ApiProperty({ example: '2026-06-19' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  interbankSettlementDate!: string;

  @ApiProperty({ example: 'SLEV' })
  @IsString()
  @IsNotEmpty()
  chargesBearer!: string;

  @ApiProperty({ example: 'RTNS' })
  @IsString()
  @IsNotEmpty()
  clearingChannel!: string;

  @ApiProperty({ example: '0100' })
  @IsString()
  @IsNotEmpty()
  serviceLevel!: string;

  @ApiProperty({ example: 'CTAA' })
  @IsString()
  @IsNotEmpty()
  localInstrument!: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  categoryPurpose!: string;

  @ApiProperty({ example: 'Pacs008 test transfer from 000000 to 999997' })
  @IsString()
  @IsNotEmpty()
  debtorInstructionInfo!: string;

  @ApiProperty({ example: 'Invoice settlement test' })
  @IsString()
  @IsNotEmpty()
  remittanceInformation!: string;

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

  @ApiProperty({ example: 'LAGOS' })
  @IsString()
  @IsNotEmpty()
  transactionLocation!: string;

  @ApiProperty({ example: '00000020260617220355027905507077370' })
  @IsString()
  @IsNotEmpty()
  nameEnquiryMsgId!: string;

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  channelCode!: string;

  @ApiProperty({ example: 'R000000000000000000B9' })
  @IsString()
  @IsNotEmpty()
  riskRating!: string;

  @ApiProperty({
    example: 'false',
    required: false,
    description:
      'Optional free-form field preserved for compatibility if you later extend the mapper.',
  })
  @IsOptional()
  @IsString()
  fixedCollectionAmount?: string;
}
