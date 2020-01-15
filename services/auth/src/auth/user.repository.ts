import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { UserAuthDto } from "./dto/userAuthDto.dto";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createNewUser(userAuthDto: UserAuthDto): Promise<User> {
    const { email, password } = userAuthDto;
    const saltRounds = 10;

    try {
      const newUser = new User();

      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(password, salt);

      newUser.email = email;
      newUser.password = hashedPassword;

      await newUser.save();

      return newUser;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
