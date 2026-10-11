import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3300",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
  },
});
