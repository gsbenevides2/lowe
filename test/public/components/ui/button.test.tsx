import { Button, buttonVariants } from "@public/components/ui/button";

import { render } from "@testing-library/react";
import { expect, test } from "bun:test";

test("Button renders a <button> with variant classes", () => {
  const { getByRole } = render(<Button variant="destructive">x</Button>);
  expect(getByRole("button").className).toContain("bg-destructive");
});

test("Button asChild renders the child element instead", () => {
  const { container } = render(
    <Button asChild>
      <a href="/x">link</a>
    </Button>,
  );
  expect(container.querySelector("a")?.className).toContain("bg-primary");
  expect(buttonVariants({ size: "lg" })).toContain("h-10");
});
