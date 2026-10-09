import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CryptoDiagnosticsResponseDto } from '../dto/crypto-diagnostics-response.dto';
import { DecryptXmlResponseDto } from '../dto/decrypt-xml-response.dto';
import { SignatureValidationResponseDto } from '../dto/signature-validation-response.dto';
import { CryptoDiagnosticsService } from './crypto-diagnostics.service';
import { CryptoDiagnosticsRequestDto } from './dto/crypto-diagnostics-request.dto';
import { DecryptXmlRequestDto } from './dto/decrypt-xml-request.dto';
import { SignatureValidationRequestDto } from './dto/signature-validation-request.dto';

@ApiTags('crypto-diagnostics')
@Controller('crypto')
export class CryptoDiagnosticsController {
  constructor(
    private readonly cryptoDiagnosticsService: CryptoDiagnosticsService,
  ) {}

  @Post('verify-signature')
  @ApiOperation({
    summary: 'Validate an XML signature against the selected public key',
  })
  @ApiOkResponse({ type: SignatureValidationResponseDto })
  verifySignature(@Body() request: SignatureValidationRequestDto) {
    return this.cryptoDiagnosticsService.validateSignature(request);
  }

  @Post('decrypt')
  @ApiOperation({
    summary:
      'Decrypt a signed-and-encrypted XML document with the local private key',
  })
  @ApiOkResponse({ type: DecryptXmlResponseDto })
  decrypt(@Body() request: DecryptXmlRequestDto) {
    return this.cryptoDiagnosticsService.decryptXml(request);
  }

  @Post('diagnose')
  @ApiOperation({
    summary:
      'Optionally decrypt XML first, then validate its signature and return combined diagnostics',
  })
  @ApiOkResponse({ type: CryptoDiagnosticsResponseDto })
  diagnose(@Body() request: CryptoDiagnosticsRequestDto) {
    return this.cryptoDiagnosticsService.diagnose(request);
  }
}
