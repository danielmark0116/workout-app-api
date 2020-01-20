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
import { AuthGuard } from "@nestjs/passport";
import { GetToken, GetRefreshToken } from "./decorators/getToken.decorator";
import { Response, Request } from "express";
import { SessionGuard } from "./guards/sessionGuard.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/refresh")
  refreshTokens(
    @GetToken() accessToken: string,
    @GetRefreshToken() refreshToken: string,
    @Res() res: Response
  ) {
    return this.authService.refreshTokens(accessToken, refreshToken, res);
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

  @Post("/logout")
  @UseGuards(AuthGuard())
  @UseGuards(SessionGuard)
  logout(@GetToken() accessToken: string): Promise<any> {
    return this.authService.logout(accessToken);
  }

  @Post("/hardlogout")
  @UseGuards(AuthGuard())
  @UseGuards(SessionGuard)
  hardLogout(@GetToken() accessToken: string): Promise<any> {
    return this.authService.hardLougout(accessToken);
  }

  @Get("/secret")
  @UseGuards(AuthGuard())
  @UseGuards(SessionGuard)
  secretRoute(): string {
    return "Secret route";
  }
}
