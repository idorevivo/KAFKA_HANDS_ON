const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "rocketchat";

let mongoClient;
let db;

const connectToMongo = async () => {
  if (db) return db;

  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();

  db = mongoClient.db(DB_NAME);

  return db;
};

const getUsersCollection = async () => {
  const database = await connectToMongo();
  return database.collection("users");
};

const getMessageCollection = async () => {
  const database = await connectToMongo();
  return database.collection("rocketchat_message");
};

const isAdminUser = async (userId) => {
  const usersCollection = await getUsersCollection();

  const user = await usersCollection.findOne(
    { _id: userId },
    { projection: { roles: 1 } },
  );

  return user?.roles?.includes("admin");
};

const getMessageById = async (messageId) => {
  const messageCollection = await getMessageCollection();

  return messageCollection.findOne({ _id: messageId });
};

module.exports = {
  isAdminUser,
  getMessageById
};
