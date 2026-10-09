import { openapi } from "@server/openapi";

import { expect, test } from "bun:test";
import { Elysia } from "elysia";

import packageJson from "../../package.json";

test("openapi plugin serves a spec with project info", async () => {
  const app = new Elysia().use(openapi).get("/x", () => "ok");
  const res = await app.handle(new Request("http://localhost/openapi/json"));
  const spec = (await res.json()) as {
    info: { title: string; version: string };
  };
  expect(spec.info.title).toBe("Edelfalter");
  expect(spec.info.version).toBe(packageJson.version);
});
