import { afterAll, expect, mock, spyOn, test } from "bun:test";

const prevEnv = process.env.NODE_ENV;
process.env.NODE_ENV = "development";

// Stub the process-level side effects index.ts triggers on import.
const serve = spyOn(Bun, "serve").mockImplementation((() => ({
  hostname: "localhost",
  port: 3000,
  stop: mock(() => {}),
})) as never);
const once = spyOn(process, "once").mockImplementation(
  (() => process) as never,
);
const log = spyOn(console, "log").mockImplementation(() => {});

const mod = await import("@server/index");

afterAll(() => {
  serve.mockRestore();
  once.mockRestore();
  log.mockRestore();
  if (prevEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = prevEnv;
});

test("startup wires instrumentation and the server", () => {
  expect(serve).toHaveBeenCalledTimes(1);
  const opts = serve.mock.calls[0]![0] as {
    port: number;
    development: boolean;
  };
  expect(opts.port).toBe(3000);
  expect(opts.development).toBe(true);
  expect(once).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
  expect(mod.server.port).toBe(3000);
});

test("app mounts the hello module", async () => {
  const res = await mod.app.handle(new Request("http://localhost/api/hello"));
  expect(await res.json()).toEqual({ message: "Hello, world!" });
});
