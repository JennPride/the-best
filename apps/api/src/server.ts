import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./auth/auth.routes";
import { authenticateHandler } from "./auth/auth.handlers";

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(jwt, { secret: process.env.JWT_SECRET! });
  app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.get(
    "/protected",
    {
      preHandler: [authenticateHandler]
    },
    async (req) => {
      return { message: "You are authenticated", user: req.user };
    }
  );

  return app;
}