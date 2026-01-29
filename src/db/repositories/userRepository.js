import { getCollection } from "../connection/mongoClient.js";

const getUsersCollection = () => getCollection("users");

export const isAdminUser = async (userId) => {
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne(
    { _id: userId },
    { projection: { roles: 1 } }
  );
  return user?.roles?.includes("admin");
};

