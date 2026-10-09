import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { PaymentInitiationRequestDto } from './dto/payment-initiation-request.dto';
import { Pain001Service } from './pain001.service';

@ApiTags('pain.001')
@Controller('messages/pain001')
export class Pain001Controller {
  constructor(private readonly pain001Service: Pain001Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pain.001 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: PaymentInitiationRequestDto) {
    return this.pain001Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pain.001 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: PaymentInitiationRequestDto) {
    return this.pain001Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pain.001 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: PaymentInitiationRequestDto) {
    return this.pain001Service.generateCompare(request);
  }
}
