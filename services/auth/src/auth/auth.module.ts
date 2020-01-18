import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwtStrategy.strategy";

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: 60 * 10
    //   }
    // }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  // providers: [AuthService, JwtStrategy]
  providers: [AuthService]
})
export class AuthModule {}
