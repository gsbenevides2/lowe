import { Elysia } from "elysia";

export const helloRoutes = new Elysia({
  prefix: "/api/hello",
  tags: ["Hello"],
}).get("/", () => ({ message: "Hello, world!" }), {
  detail: { summary: "Hello world" },
});
