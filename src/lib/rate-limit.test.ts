import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const key = `test-${Math.random()}`;
    const r1 = rateLimit(key, 3, 1000);
    const r2 = rateLimit(key, 3, 1000);
    const r3 = rateLimit(key, 3, 1000);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks the next request past the limit", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 2, 1000);
    rateLimit(key, 2, 1000);
    const r3 = rateLimit(key, 2, 1000);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("uses separate buckets per key", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    rateLimit(keyA, 1, 1000);
    const r = rateLimit(keyB, 1, 1000);
    expect(r.allowed).toBe(true);
  });
});
