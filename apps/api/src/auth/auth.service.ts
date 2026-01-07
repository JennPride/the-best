import bcrypt from "bcryptjs";

type User = {
  id: string;
  email: string;
  passwordHash: string;
};

// TEMP in-memory store (replace with Prisma later)
const users = new Map<string, User>();

export async function register(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
  };

  users.set(email, user);
  return user;
}

export async function login(email: string, password: string) {
  const user = users.get(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}
