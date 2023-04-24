import type { AWS } from '@serverless/typescript';

const SERVICE_NAME = 'rds-react-shop';

const serverlessConfiguration: AWS ={
  service: SERVICE_NAME,
  plugins: ['serverless-offline', 'serverless-dotenv-plugin'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['rds-data:ExecuteStatement'],
            Resource: [`${process.env.PG_ARN}`],
          },
        ],
      },
    },
    httpApi: {
        cors: {
            allowedOrigins: ['*'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
            maxAge: 600,
          },
        },
    environment: {
      PG_ARN: process.env.PG_ARN,
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
    },
  },
  functions: {
    bootstrap: {
      handler: 'dist/stacks/cart-service/main.handler',
      description: 'Cart service "NestJS based Application"',
      timeout: 29,
      events: [
        {
          httpApi: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          httpApi: {
            method: 'ANY',
            path: '/{proxy+}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;