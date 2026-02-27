import { injectable } from "inversify";

export interface PaymentStatus {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

@injectable()
export class PaymentService {
  getStatus(id: string): PaymentStatus {
    return {
      id,
      amount: 100,
      currency: "USD",
      status: "pending",
    };
  }
}
