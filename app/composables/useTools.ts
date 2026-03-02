import { compressToBase64, decompressFromBase64 } from "lz-string";
import { JSONC } from "jsonc.min";

export function routerPushWithQuery(
  route: any,
  router: any,
  path: string,
  query: Record<string, any>,
) {
  if (route.path.includes("/dev")) {
    path = path + "/dev";
  }
  router.push({
    path,
    query: {
      ...route.query,
      ...query,
    },
  });
}

export function jsonLzEncode(obj: any) {
  try {
    return compressToBase64(JSONC.minify(obj));
  } catch (e) {
    console.error("Failed to compress JSON:", e);
    return "";
  }
}

export function jsonLzDecode(str: string) {
  try {
    return JSONC.parse(decompressFromBase64(str));
  } catch (e) {
    console.error("Failed to decompress JSON:", e);
    return null;
  }
}
