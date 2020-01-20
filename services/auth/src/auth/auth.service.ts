import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { UserRepository } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./interfaces/accessToken.interface";
import { Session } from "./session.entity";
import { RefreshTokenPayload } from "./interfaces/refreshToken.interface";
import { Response } from "express";
import { SessionRepository } from "./session.repository";

@Injectable()
export class AuthService {
  constructor(
    private UserRepository: UserRepository,
    private jwtService: JwtService,
    private sessionRepository: SessionRepository
  ) {}

  async createNewUser(
    userAuthDto: UserAuthDto,
    res: Response
  ): Promise<Response> {
    const newUser = await this.UserRepository.createNewUser(userAuthDto);

    const newSession = new Session();
    newSession.user = newUser;
    newSession.userId = newUser.id;
    await newSession.save();

    const payload: AccessTokenPayload = {
      email: newUser.email,
      userId: newUser.id,
      sessionId: newSession.id
    };

    const refreshPayload: RefreshTokenPayload = { sessionId: newSession.id };

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
      const newSession = new Session();
      newSession.user = user;
      newSession.userId = user.id;
      await newSession.save();

      const payload: AccessTokenPayload = {
        email: user.email,
        userId: user.id,
        sessionId: newSession.id
      };

      const refreshPayload: RefreshTokenPayload = { sessionId: newSession.id };

      const accessToken = await this.jwtService.signAsync(payload);

      const refreshToken = await this.jwtService.signAsync(refreshPayload, {
        expiresIn: 60 * 60 * 24 * 30
      });

      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      return res.send(accessToken);
    }

    throw new UnauthorizedException("Unauthorized");
  }

  async refreshTokens(
    accessToken: string,
    refreshToken: string,
    res: Response
  ) {
    await this.jwtService.verifyAsync(accessToken, {
      ignoreExpiration: true
    });
    await this.jwtService.verifyAsync(refreshToken);

    const accessPayload = await this.jwtService.decode(accessToken);
    const refreshPayload = await this.jwtService.decode(refreshToken);

    if (
      typeof accessPayload !== "string" &&
      typeof refreshPayload !== "string"
    ) {
      if (accessPayload?.sessionId !== refreshPayload?.sessionId) {
        throw new UnauthorizedException("Tokens are not a pair");
      }

      const { email, sessionId } = accessPayload;

      const user = await this.UserRepository.findOneOrFail({
        email: email
      });

      const session = await Session.findOne({ user, id: sessionId });

      if (!session) {
        throw new UnauthorizedException("Out of session");
      }

      // REISSUE

      await session.remove();

      const newSession = new Session();
      newSession.user = user;
      newSession.userId = user.id;
      await newSession.save();

      const newPayload: AccessTokenPayload = {
        email: user.email,
        userId: user.id,
        sessionId: newSession.id
      };

      const newRefreshPayload: RefreshTokenPayload = {
        sessionId: newSession.id
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload);
      const newRefreshToken = await this.jwtService.signAsync(
        newRefreshPayload
      );

      res.cookie("refreshToken", newRefreshToken);

      return res.send(newAccessToken);
    }

    throw new UnauthorizedException("Could not refresh tokens");
  }

  async logout(accessToken: string): Promise<any> {
    const accessPayload = await this.jwtService.decode(accessToken);

    if (typeof accessPayload !== "string") {
      await this.sessionRepository.deleteSession(accessPayload.sessionId);

      return "Session deleted";
    }

    throw new UnauthorizedException("Could not log out");
  }

  async hardLougout(accessToken: string): Promise<any> {
    const accessPayload = await this.jwtService.decode(accessToken);

    if (typeof accessPayload !== "string") {
      await this.sessionRepository.deleteAllSessions(accessPayload.userId);

      return "All sessions deleted";
    }

    throw new UnauthorizedException("Could not hard log out");
  }
}
