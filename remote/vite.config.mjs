import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "remote",
      filename: "remote.js",
      exposes: {
        "./Component": "./src/Component",
      },
      // list of shared modules
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
      dts: false,
    }),
    react(),
  ],
  build: {
    target: "chrome89",
    emptyOutDir: false,
  },
  environments: {
    client: {
      build: { outDir: "dist/client" },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        ssr: "./src/Component.jsx",
      },
    },
  },
  //  ssr: { noExternal: true },
  server: {
    origin: "http://localhost:8081",
    port: 8081,
    cors: true,
  },
  preview: { port: 8081, cors: true },
});
