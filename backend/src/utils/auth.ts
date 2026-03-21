import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production");
}

const EFFECTIVE_JWT_SECRET = JWT_SECRET || "dev-only-insecure-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "24h") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ userId }, EFFECTIVE_JWT_SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, EFFECTIVE_JWT_SECRET, {
      algorithms: ["HS256"],
    }) as { userId: number };
  } catch {
    return null;
  }
}
