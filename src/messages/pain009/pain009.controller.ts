import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { MandateInitiationRequestDto } from './dto/mandate-initiation-request.dto';
import { Pain009Service } from './pain009.service';

@ApiTags('pain.009')
@Controller('messages/pain009')
export class Pain009Controller {
  constructor(private readonly pain009Service: Pain009Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate pain.009 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: MandateInitiationRequestDto) {
    return this.pain009Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate pain.009 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiOkResponse({ type: GeneratedMessageResponseDto })
  generateNative(@Body() request: MandateInitiationRequestDto) {
    return this.pain009Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate pain.009 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiOkResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: MandateInitiationRequestDto) {
    return this.pain009Service.generateCompare(request);
  }
}
