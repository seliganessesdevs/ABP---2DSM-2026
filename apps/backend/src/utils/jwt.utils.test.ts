import { describe, it, expect } from "vitest";
import { generateToken, verifyToken } from "./jwt.utils";

describe("jwt.utils", () => {
      it("gera um token JWT válido e decodifica corretamente", () => {
            const payload = { sub: "123", role: "SECRETARIA" };
            const token = generateToken(payload);
            expect(typeof token).toBe("string");
            const decoded = verifyToken(token);
            expect(decoded.sub).toBe(payload.sub);
            expect(decoded.role).toBe(payload.role);
            expect(decoded.exp).toBeDefined();
      });

      it("lança erro ao verificar token inválido", () => {
            expect(() => verifyToken("token.invalido.aqui")).toThrow();
      });
});