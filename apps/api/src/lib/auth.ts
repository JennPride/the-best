import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}
