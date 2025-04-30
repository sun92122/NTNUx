// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  app: {
    baseURL: "/", // 使用自訂網域，保留為根路徑
  },
  nitro: {
    preset: "static",
  },

  modules: ["@primevue/nuxt-module"],

  css: ["primeicons/primeicons.css"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          dark: false,
          darkModeSelector: ".dark-mode-toggle",
        },
      },
    },
    components: {
      prefix: "Prime",
      exclude: ["Editor", "Chart", "Form", "FormField"], // To fix import error from PrimeVue
    },
  },

  devtools: { enabled: true },

  ssr: false,

  compatibilityDate: "2024-07-05",
});
