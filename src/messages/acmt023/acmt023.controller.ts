import { Body, Controller, Post } from '@nestjs/common';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratedMessageComparisonResponseDto } from '../../common/dto/generated-message-comparison-response.dto';
import { GeneratedMessageResponseDto } from '../../common/dto/generated-message-response.dto';
import { Acmt023Service } from './acmt023.service';
import { NativeGeneratedMessageResponseDto } from './dto/native-generated-message-response.dto';
import { VerificationRequestDto } from './dto/verification-request.dto';

@ApiTags('acmt.023')
@Controller('messages/acmt023')
export class Acmt023Controller {
  constructor(private readonly acmt023Service: Acmt023Service) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate acmt.023 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiAcceptedResponse({ type: GeneratedMessageResponseDto })
  generate(@Body() request: VerificationRequestDto) {
    return this.acmt023Service.generate(request);
  }

  @Post('generate-native')
  @ApiOperation({
    summary:
      'Generate acmt.023 plain, signed, and signed-encrypted XML inside NestJS',
  })
  @ApiAcceptedResponse({ type: NativeGeneratedMessageResponseDto })
  generateNative(@Body() request: VerificationRequestDto) {
    return this.acmt023Service.generateNative(request);
  }

  @Post('generate-compare')
  @ApiOperation({
    summary:
      'Generate acmt.023 twice inside NestJS and compare the resulting artifacts',
  })
  @ApiAcceptedResponse({ type: GeneratedMessageComparisonResponseDto })
  generateCompare(@Body() request: VerificationRequestDto) {
    return this.acmt023Service.generateCompare(request);
  }
}
