import { default_format, formatters, RFC1738, RFC3986 } from "./formats.ts";

const formats = {
  formatters,
  RFC1738,
  RFC3986,
  default: default_format,
};

export { stringify } from "./stringify.ts";
export { formats };

export type {
  DefaultDecoder,
  DefaultEncoder,
  Format,
  ParseOptions,
  StringifyOptions,
} from "./types.ts";
