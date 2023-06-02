import fs from "node:fs";
import path from "node:path";
import { cleanUrl } from "../utils.mjs";
import { INJECT_HTML } from "../constants.mjs";

const clientMw = (config) => {
  const { root } = config;

  return async function (req, res, next) {
    if (req.url.endsWith("html")) {
      const fullPath = path.join(root, cleanUrl(req.url));
      if (fs.existsSync(fullPath)) {
        try {
          let html = fs.readFileSync(fullPath, "utf-8");
          html = html.replace(/<\/body>/, `${INJECT_HTML}</body>`);
          return res.end(html);
        } catch (e) {
          return next(e);
        }
      }
    } else {
      next();
    }
  };
};

export default clientMw;
