import sirv from "sirv";
import { jsReg } from "../constants.mjs";

const staticMw = (config, headers) => {
  const { root } = config;
  const serve = sirv(root, {
    dev: true,
    etag: true,
    extensions: [],
    setHeaders(res, pathname) {
      if (jsReg.test(pathname)) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
    ...headers,
  });

  return function (req, res, next) {
    serve(req, res, next);
  };
};
export default staticMw;
