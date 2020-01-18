import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./interfaces/accessToken.interface";

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

      return await this.jwtService.sign(payload);
    }

    throw new UnauthorizedException("Invalid credentials");
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({});

    return users;
  }
}
