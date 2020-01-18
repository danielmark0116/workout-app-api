import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./auth/user.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "auth_db",
      // host: "localhost",
      port: 5432,
      // port: 6000,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User],
      synchronize: true
    })
  ]
})
export class AppModule {}
