import { controller, httpGet, requestParam } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../types";
import { PaymentService } from "../services/payment.service";

@controller("/payments")
export class PaymentController {
  constructor(
    @inject(TYPES.PaymentService) private readonly paymentService: PaymentService
  ) {}

  @httpGet("/:id/status")
  public getStatus(@requestParam("id") id: string) {
    return this.paymentService.getStatus(id);
  }
}
