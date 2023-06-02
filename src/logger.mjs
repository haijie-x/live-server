import readline from "node:readline";
import colors from "picocolors";

function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

const createLogger = () => {
  const prefix = "[live-server]: ";
  const output = (type, msg) => {
    switch (type) {
      case "info":
        console.log(colors.cyan(prefix + msg));
        break;

      case "warn":
        console.log(colors.yellow(prefix + msg));
        break;

      case "error":
        console.log(colors.red(prefix + msg));
        break;

      default:
        break;
    }
  };
  const logger = {
    info(msg) {
      output("info", msg);
    },
    warn() {
      output("warn", msg);
    },
    error() {
      output("error", msg);
    },
    clear: clearScreen,
  };
  return logger;
};

const logger = createLogger();

export default logger;
