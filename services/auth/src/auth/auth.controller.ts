import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Post
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserAuthDto } from "./dto/userAuthDto.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  helloWorld(): string {
    return "yolo";
  }

  @Post("/signup")
  @UsePipes(ValidationPipe)
  signUpUser(@Body() userAuthDto: UserAuthDto): string {
    return "sign UP user route";
  }

  @Post("/signin")
  @UsePipes(ValidationPipe)
  signInUser(@Body() userAuthDto: UserAuthDto): string {
    return "sign IN user route";
  }
}
