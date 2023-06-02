import createServer from "./server.mjs";
import logger from "./logger.mjs";

const run = (
  config = {
    root: "/Users/xiehaijie/Desktop/Projects/FrontEnd/live-server/demo",
  }
) => {
  const { server, ws, watcher, listen } = createServer(config);

  const handleProcessExit = async () => {
    try {
      process.off("SIGTERM", handleProcessExit);
      await Promise.allSettled([ws.close(), server.close(), watcher.close()]);
    } catch (error) {
      logger.red("进程退出失败");
    } finally {
      logger.info("进程退出");
      process.exit();
    }
  };

  process.on("SIGINT", handleProcessExit);
  process.on("SIGQUIT", handleProcessExit);
  process.on("SIGTERM", handleProcessExit);

  logger.clear();

  listen(() => {
    logger.info("HTTP 服务器已启动");
  });
};

run();
