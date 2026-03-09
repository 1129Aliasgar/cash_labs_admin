declare module 'kafkajs' {
  export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    logLevel?: number;
    [key: string]: unknown;
  }

  export const logLevel: { NOTHING: number; [key: string]: number };

  export class Kafka {
    constructor(config: KafkaConfig);
    producer(): Producer;
  }

  export interface Producer {
    connect(): Promise<void>;
    send(params: {
      topic: string;
      messages: Array<{ value: string }>;
    }): Promise<unknown>;
  }
}
