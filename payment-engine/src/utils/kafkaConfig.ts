import { Kafka, KafkaConfig } from 'kafkajs';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates a Kafka client configuration with support for Digital Ocean managed Kafka
 * Uses SSL certificates for authentication
 */
export function createKafkaConfig(clientId: string): KafkaConfig {
  const kafkaHost =
    process.env.KAFKA_HOST ||
    process.env.KAFKA_BROKER?.split(':')[0] ||
    'localhost';
  const kafkaPort =
    process.env.KAFKA_PORT ||
    process.env.KAFKA_BROKER?.split(':')[1] ||
    '9092';

  const broker = `${kafkaHost}:${kafkaPort}`;

  const projectRoot = process.cwd();
  const certPath = path.join(projectRoot, 'user-access-certificate.crt');
  const keyPath = path.join(projectRoot, 'user-access-key.key');
  const caPath = path.join(projectRoot, 'ca-certificate.crt');

  if (!fs.existsSync(certPath)) {
    throw new Error(
      `Certificate file not found: ${certPath}. Current working directory: ${projectRoot}`
    );
  }
  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `Key file not found: ${keyPath}. Current working directory: ${projectRoot}`
    );
  }
  if (!fs.existsSync(caPath)) {
    throw new Error(
      `CA certificate file not found: ${caPath}. Current working directory: ${projectRoot}`
    );
  }

  const kafkaConfig: KafkaConfig = {
    clientId,
    brokers: [broker],
    ssl: {
      rejectUnauthorized: false,
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      ca: [fs.readFileSync(caPath)],
    },
  };

  const kafkaUsername = process.env.KAFKA_USERNAME;
  const kafkaPassword = process.env.KAFKA_PASSWORD;
  if (kafkaUsername && kafkaPassword) {
    kafkaConfig.sasl = {
      mechanism: 'plain',
      username: kafkaUsername,
      password: kafkaPassword,
    };
  }

  return kafkaConfig;
}

/**
 * Creates a Kafka client instance with the given client ID
 */
export function createKafkaClient(clientId: string): Kafka {
  return new Kafka(createKafkaConfig(clientId));
}
