declare module 'kafkajs' {
  export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    ssl?: {
      rejectUnauthorized?: boolean;
      cert?: Buffer;
      key?: Buffer;
      ca?: Buffer[];
      [key: string]: unknown;
    };
    sasl?: {
      mechanism: 'plain' | string;
      username: string;
      password: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  export class Kafka {
    constructor(config: KafkaConfig);
    consumer(config: {
      groupId: string;
      sessionTimeout?: number;
      heartbeatInterval?: number;
      maxWaitTimeInMs?: number;
      rebalanceTimeout?: number;
    }): Consumer;
    producer(): Producer;
  }

  export interface Producer {
    connect(): Promise<void>;
    send(params: {
      topic: string;
      messages: Array<{ value: string }>;
    }): Promise<unknown>;
  }

  export interface Consumer {
    connect(): Promise<void>;
    subscribe(params: { topic: string; fromBeginning?: boolean }): Promise<void>;
    run(params: {
      eachMessage?(params: { topic: string; partition: number; message: { value: Buffer | null } }): Promise<void>;
    }): Promise<void>;
  }
}
