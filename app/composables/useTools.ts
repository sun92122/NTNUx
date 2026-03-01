export function decodeBase64ToJson(base64String: string) {
  try {
    const jsonString = Buffer.from(base64String, "base64").toString("utf-8");
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to decode base64 string:", e);
    return null;
  }
}

export function routerPushWithQuery(
  route: any,
  router: any,
  path: string,
  query: Record<string, any>,
) {
  router.push({
    path,
    query: {
      ...route.query,
      ...query,
    },
  });
}
