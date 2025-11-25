import { spawnSync } from "child_process";
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["./src/index.ts"],
  splitting: false,
  minify: true,
  clean: true,
  dts: false,
  format: "esm",
  bundle: !options.watch,
  tsconfig: "./tsconfig.json",
  loader: {
    ".otf": "copy",
  },
  esbuildOptions(options) {
    options.assetNames = "assets/fonts/[name]";
  },
  async onSuccess() {
    // In watch mode we will build using this function.
    // If not in watch mode, we run tsc separately
    // to make sure PR validation works
    if (!options.watch) return;
    console.log("⚙️ Generating typescript declarations..");
    spawnSync("tsc", [
      "--project",
      "tsconfig.json",
      "--emitDeclarationOnly",
      "--declaration",
    ]);
  },
}));
