// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/", // 使用自訂網域，保留為根路徑
  },
  nitro: {
    preset: "static",
  },

  devtools: { enabled: true },

  ssr: false,

  compatibilityDate: "2024-07-05",
});
