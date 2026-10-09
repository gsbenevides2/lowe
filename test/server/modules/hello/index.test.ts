import { helloRoutes } from "@server/modules/hello";

import { expect, test } from "bun:test";

test("GET /api/hello returns the greeting", async () => {
  const res = await helloRoutes.handle(
    new Request("http://localhost/api/hello"),
  );
  expect(await res.json()).toEqual({ message: "Hello, world!" });
});
