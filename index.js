import { runRocketchatConsumer } from "./src/consumers/rocketchatConsumer.js";
import { AppError } from "./src/errors/AppError.js";

(async () => {
  try {
    await runRocketchatConsumer();
    console.log("RocketChat consumer started");
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`[${err.name}] ${err.message}`);
    } else {
      console.error(`Unhandled application error: ${err.message}`);
    }

    process.exit(1);
  }
})();
