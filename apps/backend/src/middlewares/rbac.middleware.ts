import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

type AllowedRole = "ADMIN" | "SECRETARIA";

export const authorize = (...allowedRoles: AllowedRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("Token ausente ou inválido", 401));
    }

    if (!allowedRoles.includes(req.user.role as AllowedRole)) {
      return next(new AppError("Acesso negado para este perfil", 403));
    }

    return next();
  };
};
