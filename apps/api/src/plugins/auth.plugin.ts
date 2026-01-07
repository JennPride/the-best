import { FastifyInstance } from "fastify";

export async function authPlugin(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (req: any, reply: any) => {
      try {
        await req.jwtVerify();
      } catch {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );
}
