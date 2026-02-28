import { controller, httpGet } from "inversify-express-utils";

@controller("/health")
export class HealthController {
  @httpGet("/")
  public get(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
