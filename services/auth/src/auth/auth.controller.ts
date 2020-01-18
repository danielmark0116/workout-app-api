import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
  UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Post("/signup")
  @UsePipes(ValidationPipe)
  signUpUser(@Body() userAuthDto: UserAuthDto): Promise<string> {
    return this.authService.createNewUser(userAuthDto);
  }

  @Post("/signin")
  @UsePipes(ValidationPipe)
  signInUser(@Body() userAuthDto: UserAuthDto): Promise<any> {
    console.log("sdfoidsfjiso");
    return this.authService.loginUser(userAuthDto);
  }

  @Get("/secret")
  // @UseGuards(AuthGuard())
  secretRoute(): string {
    return "Secret route";
  }
}
