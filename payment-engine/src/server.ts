import "reflect-metadata";
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { createContainer } from "./container";
import { HealthController } from "./controllers/health.controller";
import { PaymentController } from "./controllers/payment.controller";

const container = createContainer();

// Register controllers (must be bound so container can inject dependencies)
container.bind(HealthController).toSelf();
container.bind(PaymentController).toSelf();

const server = new InversifyExpressServer(container)
  .setConfig((app) => {
    app.use(express.json());
  })
  .build();

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`Payment engine listening on http://localhost:${port}`);
});
