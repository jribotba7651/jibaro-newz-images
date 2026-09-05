import { describe, it, expect } from "vitest";

// Test trivial de la Etapa 0: confirma que Vitest corre.
// El motor real y sus fixtures llegan en la Etapa 1.
describe("scaffold", () => {
  it("corre Vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
