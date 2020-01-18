import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./auth/user.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      // host: "auth_db",
      port: 5432,
      // port: 6000,
      // username: process.env.POSTGRES_USER,
      username: "postgres",
      // password: process.env.POSTGRES_PASSWORD,
      password: "postgres",
      // database: process.env.POSTGRES_DB,
      database: "postgres",
      entities: [User],
      synchronize: true
    })
  ]
})
export class AppModule {}
