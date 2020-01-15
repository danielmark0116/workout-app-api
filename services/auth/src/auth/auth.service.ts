import { Injectable } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export class AuthService {
  constructor(private UserRepository: UserRepository) {}

  async createNewUser(userAuthDto: UserAuthDto): Promise<User> {
    return this.UserRepository.createNewUser(userAuthDto);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({});

    return users;
  }
}
