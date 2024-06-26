import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Request, Response } from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import AppError from './shared/errors/AppError'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const config = new DocumentBuilder()
    .setTitle('API My Finance')
    .setDescription('Financial management')
    .setVersion('1.0')
    .addTag('API')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.use(
    (
      err: Error,
      request: Request,
      response: Response,
      _next: any,
    ) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        })
      }
      _next()
    },
  )

  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`),
  )
}

bootstrap()
