import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerificationRequestDto {
  @ApiProperty({
    example: '999997',
    description: 'Six-digit member identifier for the beneficiary institution.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  beneficiaryId!: string;

  @ApiProperty({
    example: 'Ponmile Joy',
    description:
      'Account holder name to place inside the ACMT.023 verification request.',
  })
  @IsString()
  @IsNotEmpty()
  partyToVerifyName!: string;

  @ApiProperty({
    example: '3157417712',
    description: 'Account number being verified.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/)
  accountNumber!: string;

  @ApiProperty({
    example: '999997',
    description:
      'Destination institution/member identifier used by the source system.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  destinationBankInstitution!: string;
}
