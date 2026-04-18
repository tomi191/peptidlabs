import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

/** Hash a plaintext password. Used to generate ADMIN_PASSWORD_HASH. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Verify a plaintext password against the stored hash.
 * Falls back to plaintext comparison if ADMIN_PASSWORD_HASH is not set
 * and ADMIN_PASSWORD (legacy plaintext) is. This eases migration.
 */
export async function verifyAdminPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    try {
      return await bcrypt.compare(plain, hash);
    } catch {
      return false;
    }
  }
  // Legacy fallback — warn loudly in logs so operators migrate.
  const legacy = process.env.ADMIN_PASSWORD;
  if (legacy) {
    console.warn(
      "[auth] ADMIN_PASSWORD_HASH not set — using legacy plaintext ADMIN_PASSWORD. Rotate to hashed form immediately."
    );
    return plain === legacy;
  }
  return false;
}
