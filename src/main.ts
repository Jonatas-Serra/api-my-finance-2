import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Request, Response } from 'express'
import { AppModule } from './app/app.module'

import AppError from './shared/errors/AppError'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
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
    },
  )
  app.enableCors()
  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`),
  )
}
bootstrap()
