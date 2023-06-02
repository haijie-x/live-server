import chokidar from "chokidar";
import connect from "connect";
import cors from "cors";
import createWebSocket from "./ws.mjs";
import logger from "./logger.mjs";
import http from "node:http";
import staticMw from "./mw/static.mjs";
import clientMw from "./mw/client.mjs";

const createServer = (config) => {
  const app = connect();
  app.use(
    cors({
      origin: true, // reflecting request origin
      credentials: true, // allowing requests with credentials
    })
  );

  app.use(clientMw(config));
  app.use(staticMw(config));

  const server = http.createServer(app);

  server.config = config;

  const ws = createWebSocket(server);
  const watcher = chokidar.watch([config.root]);

  watcher.on("change", async (file) => {
    ws.send(file);
  });

  return {
    ws,
    watcher,
    server,
    listen(cb) {
      app.listen(5500, cb);
      ws.listen(24678);
    },
  };
};

export default createServer;
