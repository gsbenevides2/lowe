import { cn } from "@public/lib/utils";

import { expect, test } from "bun:test";

test("cn merges conflicting tailwind classes", () => {
  expect(cn("p-2", undefined, "p-4")).toBe("p-4");
});
