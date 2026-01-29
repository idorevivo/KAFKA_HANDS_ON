import { runConsumer } from "./src/consumers/rocketchatConsumer.js";

(async () => {
  try {
    await runConsumer();
    console.log("RocketChat consumer started");
  } catch (err) {
    console.error("Failed to start RocketChat consumer", err);
  }
})();