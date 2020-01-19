import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./interfaces/accessToken.interface";
import * as uuid from "uuid";
import { TokenResponse } from "./interfaces/tokenResponse.interface";
import { Session } from "./session.entity";
import { RefreshTokenPayload } from "./interfaces/refreshToken.interface";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private UserRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async createNewUser(
    userAuthDto: UserAuthDto,
    res: Response
  ): Promise<Response> {
    const newUser = await this.UserRepository.createNewUser(userAuthDto);

    const sessionId = await uuid.v4();

    const payload: AccessTokenPayload = {
      email: newUser.email,
      userId: newUser.id,
      sessionId
    };

    const refreshPayload: RefreshTokenPayload = { sessionId };

    const newSession = new Session();
    newSession.sessionId = sessionId;
    newSession.user = newUser;
    await newSession.save();

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: 60 * 60 * 24 * 30
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.send(accessToken);
  }

  async signInUser(userAuthDto: UserAuthDto, res: Response): Promise<Response> {
    const { email, password } = userAuthDto;

    const user = await this.UserRepository.findOne({ email });

    if (user && user.validatePassword(password)) {
      const sessionId = await uuid.v4();

      const payload: AccessTokenPayload = {
        email: user.email,
        userId: user.id,
        sessionId
      };

      const refreshPayload: RefreshTokenPayload = { sessionId };

      const newSession = new Session();
      newSession.sessionId = sessionId;
      newSession.user = user;
      await newSession.save();

      const accessToken = await this.jwtService.signAsync(payload);

      const refreshToken = await this.jwtService.signAsync(refreshPayload, {
        expiresIn: 60 * 60 * 24 * 30
      });

      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      return res.send(accessToken);
    }

    throw new UnauthorizedException("Unauthorized");
  }

  async refreshTokens(accessToken: string, refreshToken: string) {
    await this.jwtService.verifyAsync(accessToken, { ignoreExpiration: true });
    await this.jwtService.verifyAsync(refreshToken);

    const accessPayload = await this.jwtService.decode(accessToken);
    const refreshPayload = await this.jwtService.decode(refreshToken);

    console.log(accessPayload);
    console.log(refreshPayload);

    if (accessPayload) {
      throw new UnauthorizedException("Tokens are not a pair");
    }

    return true;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({});

    return users;
  }
}
