import { Module, Global } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwtStrategy.strategy";
import { SessionRepository } from "./session.repository";

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // secret: "process.env.JWT_SECRET",
      signOptions: {
        expiresIn: 60 * 10
      }
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([UserRepository, SessionRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
