import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";

@Controller("test")
export class TestController {
  constructor() {}

  @Get()
  test() {
    return "sdf";
  }
}
