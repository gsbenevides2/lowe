import { metrics } from "@opentelemetry/api";

// Instruments bind to the global MeterProvider installed by instrumentHttpServer.ts.
const meter = metrics.getMeter("edelfalter");

export const httpClientDuration = meter.createHistogram(
  "http.client.request.duration",
  { description: "Outgoing HTTP request duration.", unit: "ms" },
);
export const dbDuration = meter.createHistogram(
  "db.client.operation.duration",
  {
    description: "Database query duration.",
    unit: "ms",
  },
);

export { meter };
