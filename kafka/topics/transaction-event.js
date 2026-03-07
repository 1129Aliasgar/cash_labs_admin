const { Kafka } = require('kafkajs');

async function createTopic() {
  const kafka = new Kafka({
    clientId: 'admin-client',
    brokers: ['localhost:9092'] // replace with your broker address
  });

  const admin = kafka.admin();
  await admin.connect();

  try {
    const created = await admin.createTopics({
      topics: [{
        topic: 'transaction-events',
        numPartitions: 1,
        replicationFactor: 1
      }
    ],
      waitForLeaders: true
    });

    console.log(created);

    if (created) {
      console.log(`Topics created successfully.`);
    } else {
      console.log(`Topics already exists or creation failed.`);
    }
  } catch (error) {
    console.error('Failed to create topic:', error);
  } finally {
    await admin.disconnect();
  }
}

createTopic();