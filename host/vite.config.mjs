import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  optimizeDeps: {
    // Pre-bundle everything the plugin's host init pulls in, and do not discover
    // more at request time: a mid-session re-optimization changes the dep hash
    // that the cached host init module still references, so the browser gets
    // "504 Outdated Optimize Dep" and the page never hydrates.
    noDiscovery: true,
    include: [
      "@module-federation/runtime",
      "@module-federation/runtime/helpers",
      "react",
      "react-dom",
      "react-dom/client",
      "react-dom/profiling",
      "react/compiler-runtime",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  ssr: {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
  build: {
    target: "chrome89",
  },

  plugins: [
    federation({
      dts: false,
      name: "dynamic-host",
      // remotes: {
      //   "mfe-b": {
      //     entry: "http://localhost:8081/mfeBBB.js",
      //     entryGlobalName: "mfeBBB",
      //     type: "module",
      //   },
      // },
      // list of shared modules with optional options

      hostInitInjectLocation: "entry",
      shared: {
        // specifying a module request as shared module
        // will provide all used modules matching this name (version from package.json)
        // and consume shared modules in the version specified in dependencies from package.json
        // (or in dev/peer/optionalDependencies)
        // So it use the highest available version of this package matching the version requirement
        // from package.json, while providing it's own version to others.

        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
    react(),
  ],
  server: {
    port: 4175,
  },
});
