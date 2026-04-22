import { describe, it, expect } from "vitest";
import { paginate } from "./pagination.utils";

describe("paginate", () => {
      it("retorna skip/take padrão", () => {
            const result = paginate({});
            expect(result).toEqual({ skip: 0, take: 20, page: 1, limit: 20 });
      });

      it("calcula skip corretamente", () => {
            const result = paginate({ page: "3", limit: "10" });
            expect(result).toEqual({ skip: 20, take: 10, page: 3, limit: 10 });
      });

      it("corrige valores inválidos", () => {
            const result = paginate({ page: "-2", limit: "0" });
            expect(result).toEqual({ skip: 0, take: 20, page: 1, limit: 20 });
      });
});