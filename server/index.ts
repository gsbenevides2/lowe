import { Elysia } from "elysia";

import indexHtml from "../public/index.html";
import { instrumentFetch } from "./instrumentation/instrumentFetch";
import { elysiaOtel } from "./instrumentation/instrumentHttpServer";
import { setupLoggerProvider } from "./instrumentation/instrumentLogger";
import { flushTelemetryOnExit } from "./instrumentation/shutdown";
import { helloRoutes } from "./modules/hello";
import { openapi } from "./openapi";

instrumentFetch();
setupLoggerProvider();
flushTelemetryOnExit();

export const app = new Elysia().use(elysiaOtel).use(openapi).use(helloRoutes);

// The OTEL plugin overrides the native home response, so "/" is served by Bun.
export const server = Bun.serve({
  port: 3000,
  routes: { "/": indexHtml },
  fetch: app.fetch,
  development: process.env.NODE_ENV !== "production",
});

console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
