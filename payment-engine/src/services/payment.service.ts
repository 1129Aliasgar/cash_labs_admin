import { injectable } from "inversify";
import { BaseService } from "./BaseService";

export interface PaymentStatus {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

@injectable()
export class PaymentService extends BaseService {
  getStatus(id: string): PaymentStatus {
    return {
      id,
      amount: 100,
      currency: "USD",
      status: "pending",
    };
  }
}
