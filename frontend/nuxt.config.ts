export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3001/api", // バックエンドのURL
    },
  },
  css: ["@/assets/styles/global.css"], 

  compatibilityDate: "2024-11-19",
});