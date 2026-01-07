import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./auth/auth.routes";
import { authPlugin } from "./plugins/auth.plugin";

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(jwt, { secret: process.env.JWT_SECRET! });

  app.register(authPlugin);
  app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.get(
    "/protected",
    { preHandler: [(app as any).authenticate] },
    async (req) => {
      return { message: "You are authenticated", user: req.user };
    }
  );

  return app;
}
