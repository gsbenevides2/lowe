import * as ReactDom from "react-dom/client";

import { act, fireEvent } from "@testing-library/react";
import { expect, spyOn, test } from "bun:test";

test("entry point mounts the app; button shows the API greeting, then an error", async () => {
  delete process.env.PUBLIC_RUM_TOKEN; // instrumentation is a no-op
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);

  const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValueOnce(
    Response.json({ message: "Hello, world!" }),
  );
  const create = spyOn(ReactDom, "createRoot");
  await act(async () => {
    await import("@public/index");
  });
  expect(root.textContent).toContain("Edelfalter");

  const button = root.querySelector("button")!;
  await act(async () => {
    fireEvent.click(button);
  });
  expect(root.textContent).toContain("Hello, world!");

  fetchSpy.mockResolvedValueOnce(new Response("nope", { status: 500 }));
  await act(async () => {
    fireEvent.click(button);
  });
  expect(root.textContent).toContain("error");

  act(() => (create.mock.results[0]!.value as ReactDom.Root).unmount());
  create.mockRestore();
  fetchSpy.mockRestore();
  root.remove();
});
