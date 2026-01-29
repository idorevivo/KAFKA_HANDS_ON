import { MongoClient } from "mongodb";
import { config } from "../../config/index.js";

let mongoClient;
let db;

const connectToMongo = async () => {
  if (db) return db;

  mongoClient = new MongoClient(config.mongo.uri);
  await mongoClient.connect();

  db = mongoClient.db(config.mongo.dbName);

  return db;
};

export const getCollection = async (name) => {
  const database = await connectToMongo();
  return database.collection(name);
};
