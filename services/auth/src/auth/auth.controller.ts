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
  test() {
    return "yolo";
  }

  @Get("/yolo")
  test2() {
    return "sdfdsifojs";
  }

  @Get("sdiufhdsui")
  sdofijds() {
    return "isdjfoisdjfi";
  }

  @Get("/secret")
  // @UseGuards(AuthGuard())
  secretRoute(): string {
    return "Secret route";
  }
}
