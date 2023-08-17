import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port, () => {
    console.log(`SERVER WORK ON PORT: ${port}`);
  });
}
bootstrap();
