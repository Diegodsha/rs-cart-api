import { NestFactory } from '@nestjs/core';

import * as helmet from 'helmet';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  const config = new DocumentBuilder()
  .setTitle('React-Shop-Database')
  .setDescription('The AWS practitioner course database documentation')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};