import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user.repository";
import { AccessTokenPayload } from "../interfaces/accessToken.interface";
import { User } from "../user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
