import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./interfaces/accessToken.interface";
import * as uuid from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private UserRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async createNewUser(userAuthDto: UserAuthDto): Promise<string> {
    const newUser = await this.UserRepository.createNewUser(userAuthDto);

    const payload: AccessTokenPayload = {
      email: newUser.email,
      userId: newUser.id
    };

    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }

  async loginUser(userAuthDto: UserAuthDto): Promise<string> {
    const { email, password } = userAuthDto;

    const user = await this.UserRepository.findOne({ email });

    if (user && user.validatePassword(password)) {
      const payload: AccessTokenPayload = {
        email: user.email,
        userId: user.id
      };

      // const sessionId = await uuid.v4();

      // user.userSessions = user.userSessions + sessionId + ",";

      // await user.save();

      return await this.jwtService.signAsync({ ...payload });
      return "s";
    }

    throw new UnauthorizedException("Invalid credentials");
  }

  async loginUser2(userAuthDto: UserAuthDto): Promise<string> {
    return "s";
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({});

    return users;
  }
}
