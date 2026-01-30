import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function authPlugin(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err: any) {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );
}
