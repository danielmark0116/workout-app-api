import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength
} from "class-validator";

export class UserAuthDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  password: string;
}
