declare module 'kafkajs' {
  export class Kafka {
    constructor(config: { clientId: string; brokers: string[]; [key: string]: unknown });
    consumer(config: {
      groupId: string;
      sessionTimeout?: number;
      heartbeatInterval?: number;
      maxWaitTimeInMs?: number;
      rebalanceTimeout?: number;
    }): Consumer;
  }

  export interface Consumer {
    connect(): Promise<void>;
    subscribe(params: { topic: string; fromBeginning?: boolean }): Promise<void>;
    run(params: {
      eachMessage?(params: { topic: string; partition: number; message: { value: Buffer | null } }): Promise<void>;
    }): Promise<void>;
  }
}
