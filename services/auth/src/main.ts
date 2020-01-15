import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const port = process.env.AUTH_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  // console.log(process.env);
  console.log(`Running app on port: ${port}`);
}
bootstrap();
