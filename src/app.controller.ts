import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('System')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API metadata and status' })
  root() {
    return {
      name: 'Stock API',
      version: '1.0.0',
      status: 'ok',
      docs: '/api',
      time: new Date().toISOString()
    };
  }
}
