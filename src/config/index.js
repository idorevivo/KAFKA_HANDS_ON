import 'dotenv/config';
import env from 'env-var';

export const config = {
  rocketChat: {
    host: env.get('ROCKETCHAT_URL').default('localhost:3000').asString(),
    user: env.get('ROCKETCHAT_USER').default('MessageBot').asString(),
    pass: env.get('ROCKETCHAT_PASSWORD').default('MessageBot').asString(),
    useSsl: env.get('ROCKETCHAT_USE_SSL').default('false').asBool(),
  },
  kafka: {
    host: env.get('KAFKA_HOST').default('localhost:9092').asString(),
    clientId: env.get('KAFKA_CLIENT_ID').default('rocketchat-consumer').asString(),
    consumerGroupId: env.get('KAFKA_CONSUMER_GROUP_ID').default('rocketchat-consumers').asString(),
    topics: {
      message: env.get('KAFKA_MESSAGE_TOPIC').default('rocketchat.rocketchat_message').asString(),
      room: env.get('KAFKA_ROOM_TOPIC').default('rocketchat.rocketchat_room').asString(),
      users: env.get('KAFKA_USERS_TOPIC').default('rocketchat.users').asString(),
    },
  },
  mongo: {
    uri: env.get('MONGO_URI').default('mongodb://localhost:27017').asString(),
    dbName: env.get('DB_NAME').default('rocketchat').asString(),
  },
  handlers: {
    triggerPopularWordMsg: env.get('TRIGGER_POPULAR_WORD_MSG').default('log popular word').asString(),
    specialRoomWords: env.get('SPECIAL_ROOM_WORDS').default('cat,black').asArray(','),
  }
};
