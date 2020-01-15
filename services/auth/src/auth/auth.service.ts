import { Injectable } from "@nestjs/common";
import { UserAuthDto } from "./dto/userAuthDto.dto";

@Injectable()
export class AuthService {
  helloWorld(userAuthDto: UserAuthDto): any {
    return userAuthDto;
  }
}
