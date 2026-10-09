import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class MandateCancellationRequestDto {
  @ApiProperty({ example: '00000020260617120653058388024195052' })
  @IsString()
  @IsNotEmpty()
  originalMessageId!: string;

  @ApiProperty({ example: '2026-06-17T12:06:53.309159+01:00' })
  @IsString()
  @IsISO8601({ strict: true, strictSeparator: true })
  originalCreationDateTime!: string;

  @ApiProperty({ example: 'CUST' })
  @IsString()
  @IsNotEmpty()
  cancellationReasonCode!: string;

  @ApiProperty({ example: 'Customer requested cancellation' })
  @IsString()
  @IsNotEmpty()
  cancellationReasonDescription!: string;

  @ApiProperty({ example: 'MND-000000-999997-007' })
  @IsString()
  @IsNotEmpty()
  originalMandateId!: string;

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
}
