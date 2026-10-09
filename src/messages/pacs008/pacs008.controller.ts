import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { Pacs008Service } from './pacs008.service';

@ApiTags('pacs.008')
@Controller('messages/pacs008')
export class Pacs008Controller {
  constructor(private readonly pacs008Service: Pacs008Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pacs.008 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: PaymentRequestDto) {
    return this.pacs008Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pacs.008 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: PaymentRequestDto) {
    return this.pacs008Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pacs.008 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: PaymentRequestDto) {
    return this.pacs008Service.generateCompare(request);
  }
}
