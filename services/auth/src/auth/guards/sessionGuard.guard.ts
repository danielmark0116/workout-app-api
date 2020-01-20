import {
  CanActivate,
  Injectable,
  Inject,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { SessionRepository } from "../session.repository";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@Inject("JwtService") private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    const payload = await this.jwtService.decode(
      req.headers.authorization.split("Bearer ")[1]
    );

    if (typeof payload !== "string") {
      const sessionId = payload.sessionId;

      return await new SessionRepository().isSessionActive(sessionId);
    }

    throw new UnauthorizedException();
  }
}
