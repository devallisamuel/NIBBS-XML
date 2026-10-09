import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { DirectDebitInitiationRequestDto } from './dto/direct-debit-initiation-request.dto';
import { Pain008Service } from './pain008.service';

@ApiTags('pain.008')
@Controller('messages/pain008')
export class Pain008Controller {
  constructor(private readonly pain008Service: Pain008Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pain.008 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: DirectDebitInitiationRequestDto) {
    return this.pain008Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pain.008 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: DirectDebitInitiationRequestDto) {
    return this.pain008Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pain.008 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: DirectDebitInitiationRequestDto) {
    return this.pain008Service.generateCompare(request);
  }
}
