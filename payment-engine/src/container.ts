import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { PaymentService } from "./services/payment.service";

export function createContainer(): Container {
  const container = new Container();

  container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);

  return container;
}
