import { describe, it, expect, beforeAll } from "vitest";
import { signAdminToken, verifyAdminToken } from "./jwt";

beforeAll(() => {
  process.env.JWT_SECRET =
    "test-secret-0123456789abcdef0123456789abcdef0123456789abcdef";
});

describe("admin JWT", () => {
  it("signs a token and verifies it back", async () => {
    const token = await signAdminToken();
    const claims = await verifyAdminToken(token);
    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe("admin");
    expect(claims?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejects a tampered token", async () => {
    const token = await signAdminToken();
    const tampered = token.slice(0, -4) + "xxxx";
    const claims = await verifyAdminToken(tampered);
    expect(claims).toBeNull();
  });

  it("rejects null/empty/garbage", async () => {
    expect(await verifyAdminToken(null)).toBeNull();
    expect(await verifyAdminToken("")).toBeNull();
    expect(await verifyAdminToken("not.a.jwt")).toBeNull();
  });
});
