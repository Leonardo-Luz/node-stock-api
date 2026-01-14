import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? 'localhost';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Stock API')
    .setDescription('This is a TDD stock API')
    .setVersion('1.0')
    .addCookieAuth('access-token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access-token',
    })
    .addCookieAuth('refresh-token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh-token',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      withCredentials: true,
    },
  });
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.enableCors({
    origin: `http://${host}:${port}`,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port, host);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
