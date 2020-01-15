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
import { User } from "./user.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Post("/signup")
  @UsePipes(ValidationPipe)
  signUpUser(@Body() userAuthDto: UserAuthDto): Promise<User> {
    return this.authService.createNewUser(userAuthDto);
  }

  @Post("/signin")
  @UsePipes(ValidationPipe)
  signInUser(@Body() userAuthDto: UserAuthDto): string {
    return "sign IN user route";
  }
}
