import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { MandateCancellationRequestDto } from './dto/mandate-cancellation-request.dto';
import { Pain011Service } from './pain011.service';

@ApiTags('pain.011')
@Controller('messages/pain011')
export class Pain011Controller {
  constructor(private readonly pain011Service: Pain011Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pain.011 plain, signed, and signed-encrypted XML using the authoritative Java implementation',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: MandateCancellationRequestDto) {
    return this.pain011Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pain.011 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: MandateCancellationRequestDto) {
    return this.pain011Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pain.011 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: MandateCancellationRequestDto) {
    return this.pain011Service.generateCompare(request);
  }
}
