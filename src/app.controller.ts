import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('System')
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      name: 'Stock API',
      version: '1.0.0',
      status: 'ok',
      docs: '/api',
      time: new Date()
    };
  }
}

