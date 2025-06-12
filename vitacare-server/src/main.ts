import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do cors
  app.enableCors();

  //configuração do validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Configuração do Swagger
  const config = new DocumentBuilder()
  .setTitle('VitaCare API')
  .setDescription('API do sistema VitaCare para gerenciamento de medicamentos e consultas médicas')
  .setVersion('1.0')
  .addTag('auth', 'Endpoints de autenticação')
  .addTag('usuarios', 'Gerenciamento de usuários')
  .addTag('medicamentos', 'Gerenciamento de medicamentos')
  .addTag('horarios-medicamentos', 'Gerenciamento de horários de medicamentos')
  .addTag('consultas', 'Gerenciamento de consultas médicas')
  .addBearerAuth() //adiciona suporte para autenticação BEARER (JWT)
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //inicialização do servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${port}/api`);
}
bootstrap();
