import nodeExternals from "rollup-plugin-node-externals";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        external: ["vscode"],
        plugins: [nodeExternals()],
        treeshake: {
          moduleSideEffects: false,
        },
      },
      // emptyOutDir: false,
      lib: {
        entry: "src/extension.ts",
        formats: ["cjs"] satisfies LibraryFormats[],
        fileName: () => "extension.js",
      },
      outDir: "dist",
    },
  };
});
