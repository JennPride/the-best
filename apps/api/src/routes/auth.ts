import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";

export default async function authRoutes(server: FastifyInstance) {
  server.post("/register", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.status(400).send({ error: "Missing fields" });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return reply.status(409).send({ error: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
      },
    });

    const token = signToken(user.id);

    return { token };
  });

  server.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);

    return { token };
  });
}
