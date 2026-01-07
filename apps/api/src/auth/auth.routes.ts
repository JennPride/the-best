import { FastifyInstance } from "fastify";
import { LoginSchema, RegisterSchema } from "./auth.schemas";
import { login, register } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const { email, password } = RegisterSchema.parse(req.body);

    const user = await register(email, password);
    const token = app.jwt.sign({ userId: user.id });

    return reply.send({ token });
  });

  app.post("/login", async (req, reply) => {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await login(email, password);
    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = app.jwt.sign({ userId: user.id });
    return reply.send({ token });
  });
}
