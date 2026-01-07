import { buildServer } from "./server";

const server = buildServer();

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 API running at ${address}`);
});
