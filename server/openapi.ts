import { openapi as elysiaOpenapi } from "@elysia/openapi";

import packageJson from "../package.json";

export const openapi = elysiaOpenapi({
  documentation: {
    info: { title: "Edelfalter", version: packageJson.version },
  },
  scalar: {
    withDefaultFonts: false,
    showDeveloperTools: "localhost",
  },
});
