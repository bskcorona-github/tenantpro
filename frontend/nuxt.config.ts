export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3001/api", // バックエンドのURL
    },
  },

  compatibilityDate: "2024-11-19",
});