import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot() // import the ENV file
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(port, "0.0.0.0", function () {
  });;
}
bootstrap();
