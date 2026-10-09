import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './common/dto/health-response.dto';

@ApiTags('health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Basic health check' })
  @ApiOkResponse({ type: HealthResponseDto })
  health(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'nibss-iso20022-generator',
    };
  }
}
