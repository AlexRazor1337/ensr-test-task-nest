import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import validationPipeConfig from './config/validation-pipe.config';

export function setup(app: INestApplication<any>): void {
  const config = new DocumentBuilder()
    .setTitle('Payments API')
    .setDescription('Mock Payments System AI')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.setGlobalPrefix('api');
}
