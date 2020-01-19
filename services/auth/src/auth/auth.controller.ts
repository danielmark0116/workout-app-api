import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
  UseGuards,
  Res
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetToken, GetRefreshToken } from "./decorators/getToken.decorator";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get("/test")
  test(
    @GetToken() accessToken: string,
    @GetRefreshToken() refreshToken: string
  ) {
    return { accessToken, refreshToken };
  }

  @Post("/refresh")
  freshTokens(
    @GetToken() accessToken: string,
    @GetRefreshToken() refreshToken: string
  ) {
    return this.authService.refreshTokens(accessToken, refreshToken);
  }

  @Post("/signup")
  @UsePipes(ValidationPipe)
  signUpUser(
    @Body() userAuthDto: UserAuthDto,
    @Res() res: Response
  ): Promise<Response> {
    return this.authService.createNewUser(userAuthDto, res);
  }

  @Post("/signin")
  @UsePipes(ValidationPipe)
  signInUser(
    @Body() userAuthDto: UserAuthDto,
    @Res() res: Response
  ): Promise<Response> {
    return this.authService.signInUser(userAuthDto, res);
  }

  @Get("/secret")
  @UseGuards(AuthGuard())
  secretRoute(): string {
    return "Secret route";
  }
}
