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

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({});

    return users;
  }
}
