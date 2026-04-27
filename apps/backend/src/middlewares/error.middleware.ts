import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'

type FieldError = {
      field: string
      message: string
}

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
      if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                  success: false,
                  message: err.message,
            })
      }

      // Body com JSON inválido (parse falhou no express.json)
      if (err?.type === 'entity.parse.failed' || err?.statusCode === 400) {
            console.error(err)
            return res.status(400).json({
                  success: false,
                  message: 'JSON inválido no corpo da requisição',
            })
      }

      if (err instanceof ZodError) {
            const errors: FieldError[] = err.issues.map((issue) => ({
                  field: issue.path.join('.') || 'body',
                  message: issue.message,
            }))

            return res.status(422).json({
                  success: false,
                  message: 'Erro de validacao',
                  errors,
            })
      }

      // Erro inesperado: loga para diagnóstico (não expõe detalhes ao cliente)
      console.error(err)

      return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
      })
}