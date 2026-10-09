import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { MandateAmendmentRequestDto } from './dto/mandate-amendment-request.dto';
import { Pain010Service } from './pain010.service';

@ApiTags('pain.010')
@Controller('messages/pain010')
export class Pain010Controller {
  constructor(private readonly pain010Service: Pain010Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pain.010 plain, signed, and signed-encrypted XML using the authoritative Java implementation',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: MandateAmendmentRequestDto) {
    return this.pain010Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pain.010 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: MandateAmendmentRequestDto) {
    return this.pain010Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pain.010 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: MandateAmendmentRequestDto) {
    return this.pain010Service.generateCompare(request);
  }
}
