import { WebSocketServer as WebSocketServerRaw } from "ws";
import { STATUS_CODES, createServer as createHttpServer } from "node:http";
import logger from "./logger.mjs";
import { getShortName } from "./utils.mjs";

// http server request handler keeps the same with
// https://github.com/websockets/ws/blob/45e17acea791d865df6b255a55182e9c42e5877a/lib/websocket-server.js#L88-L96
const route = (_, res) => {
  const statusCode = 426;
  const body = STATUS_CODES[statusCode];
  if (!body)
    throw new Error(`No body text found for the ${statusCode} status code`);

  res.writeHead(statusCode, {
    "Content-Length": body.length,
    "Content-Type": "text/plain",
  });
  res.end(body);
};

const createWebSocket = ({ config }) => {
  const wsHttpServer = createHttpServer(route);
  const wss = new WebSocketServerRaw({ server: wsHttpServer });
  // 监听 WebSocket 连接
  wss.on("connection", (ws) => {
    logger.info("服务端 ws 启动");
    // 监听 WebSocket 消息
    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
    });
  });
  return {
    listen(...args) {
      wsHttpServer.listen(...args);
    },
    send(...args) {
      let payload;
      if (typeof args[0] === "string") {
        payload = {
          path: "/" + getShortName(args[0], config.root),
        };
      } else {
        payload = args[0];
      }
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        // readyState 1 means the connection is open
        if (client.readyState === 1) {
          client.send(stringified);
        }
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        wss.clients.forEach((client) => {
          client.terminate();
        });
        wss.close((err) => {
          if (err) {
            reject(err);
          } else {
            if (wsHttpServer) {
              wsHttpServer.close((err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            } else {
              resolve();
            }
          }
        });
      });
    },
  };
};

export default createWebSocket;
