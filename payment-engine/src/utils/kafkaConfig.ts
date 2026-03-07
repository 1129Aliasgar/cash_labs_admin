import { Kafka, KafkaConfig, logLevel } from 'kafkajs';

function parseBrokers(): string[] {
  const raw = process.env.KAFKA_BROKERS || 'localhost:9092';
  return raw
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
}

export function createKafkaClient(clientId: string): Kafka {
  const brokers = parseBrokers();
  const config: KafkaConfig = {
    clientId,
    brokers,
    logLevel: logLevel.NOTHING,
  };
  return new Kafka(config);
}
