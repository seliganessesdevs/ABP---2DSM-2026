import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "./hash.util";

describe("hash.util", () => {
      it("gera um hash diferente da senha original", async () => {
            const senha = "minhaSenhaSegura";
            const hash = await hashPassword(senha);
            expect(hash).not.toBe(senha);
            expect(hash).toMatch(/^\$argon2id/); // começa com $argon2id
      });

      it("valida senha correta", async () => {
            const senha = "minhaSenhaSegura";
            const hash = await hashPassword(senha);
            const resultado = await comparePassword(senha, hash);
            expect(resultado).toBe(true);
      });

      it("rejeita senha incorreta", async () => {
            const senha = "minhaSenhaSegura";
            const hash = await hashPassword(senha);
            const resultado = await comparePassword("errada", hash);
            expect(resultado).toBe(false);
      });
});