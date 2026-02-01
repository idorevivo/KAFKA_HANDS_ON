import { runRocketchatConsumer } from "./src/consumers/rocketchatConsumer.js";

(async () => {
  try {
    await runRocketchatConsumer();
    console.log("RocketChat consumer started");
  } catch (err) {
    console.error("Failed to start RocketChat consumer", err);
  }
})();