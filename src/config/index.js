import 'dotenv/config'; 

export const config = {
  rocketChat: {
    host: process.env.ROCKETCHAT_HOST,
    user: process.env.ROCKETCHAT_USER,
    pass: process.env.ROCKETCHAT_PASS,
  },
  kafka: {
    host: process.env.KAFKA_HOST,
    clientId: process.env.KAFKA_CLIENT_ID,
    messageTopic: process.env.KAFKA_MESSAGE_TOPIC,
    roomTopic: process.env.KAFKA_ROOM_TOPIC,
    usersTopic: process.env.KAFKA_USERS_TOPIC,
    consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  },
  mongo: {
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  },
};
