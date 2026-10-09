import type { helloRoutes } from "@server/modules/hello";

import { treaty } from "@elysia/eden";

export const helloClient = treaty<typeof helloRoutes>("", { keepDomain: true });
