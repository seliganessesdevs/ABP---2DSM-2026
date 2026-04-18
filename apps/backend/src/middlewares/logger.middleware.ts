import type { Request, Response, NextFunction } from 'express'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
      const startedAt = Date.now()
      const method = req.method
      const path = req.originalUrl
      res.on('finish', () => {
            const durationMs = Date.now() - startedAt
            const statusCode = res.statusCode
            const timestamp = new Date().toISOString()

            console.log(`${timestamp} ${method} ${path} ${statusCode} ${durationMs}ms`)
      })
      next()
}