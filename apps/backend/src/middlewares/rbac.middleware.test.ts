import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "../errors/AppError";
import { authorize } from "./rbac.middleware";

function createResponse() {
  return {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
}

describe("authorize", () => {
  it("retorna 401 quando req.user nao existe", () => {
    const req = {} as Request;
    const res = createResponse();
    const next = vi.fn();

    authorize("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(401);
  });

  it("retorna 403 quando o role nao tem permissao", () => {
    const req = { user: { role: "SECRETARIA" } } as Request;
    const res = createResponse();
    const next = vi.fn();

    authorize("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it("libera o fluxo quando o role e permitido", () => {
    const req = { user: { role: "ADMIN" } } as Request;
    const res = createResponse();
    const next = vi.fn();

    authorize("ADMIN", "SECRETARIA")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
