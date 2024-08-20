import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './shared/validation/validation-exception-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  await app.listen(8080);
}
bootstrap();
