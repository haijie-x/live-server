import posix from "node:path/posix";
import { postfixRE } from "./constants.mjs";

export function cleanUrl(url) {
  return url.replace(postfixRE, "");
}

export function getShortName(file, root) {
  return file.startsWith(root + "/") ? posix.relative(root, file) : file;
}
