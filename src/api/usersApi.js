import { api } from "@rocket.chat/sdk";
import { ApiError } from "../errors/ApiError.js";

export const isAdminUser = async (userId) => {
  const res = await api.get("users.info", {
    userId,
  });

  if (!res || res.success !== true) {
    throw new ApiError(`Failed to fetch user: ${JSON.stringify(res)}`);
  }

  const roles = res.user?.roles || [];
  return roles.includes("admin");
};
