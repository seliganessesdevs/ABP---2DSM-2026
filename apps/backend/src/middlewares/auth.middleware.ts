import type { RequestHandler } from 'express'
import { AppError } from '../errors/AppError'
import { verifyToken } from '../utils/jwt.utils'

type TokenPayload = ReturnType<typeof verifyToken>

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
    const authHeader = req.headers.authorization
        const [scheme, token] = authHeader?.split(' ') ?? []
                if (scheme !== 'Bearer' || !token) {
                     throw new AppError('Token ausente ou inválido', 401)
        }
             try {
  const payload = verifyToken(token)
  req.user = payload
  return next()
            } catch {
            throw new AppError('Token ausente ou inválido', 401)
    }

}