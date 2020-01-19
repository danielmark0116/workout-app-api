import { Module, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./auth/user.entity";
import { Session } from "./auth/session.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "auth_db",
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Session],
      synchronize: true
    })
  ]
})
export class AppModule {}
