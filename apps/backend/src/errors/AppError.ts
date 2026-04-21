export class AppError extends Error {
      public readonly statusCode: number
      public readonly isOperational: boolean

      constructor(message: string, statusCode: number) {
            super(message)

            this.name = 'AppError'
            this.statusCode = statusCode
            this.isOperational = true

            Object.setPrototypeOf(this, AppError.prototype)
      }
}