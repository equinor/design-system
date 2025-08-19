var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { spawnSync } from "child_process";
import { defineConfig } from "tsup";
export default defineConfig(options => ({
    entry: ["./src/**/*.ts?(x)", "!./src/types.d.ts", "!./src/__tests__/*"],
    splitting: true,
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
    onSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            // In watch mode we will build using this function.
            // If not in watch mode, we run tsc separately
            // to make sure PR validation works
            if (!options.watch)
                return;
            // eslint-disable-next-line no-console
            console.log("⚙️ Generating typescript declarations..");
            spawnSync("tsc", ["--project", "tsconfig.json", "--emitDeclarationOnly", "--declaration"]);
        });
    },
}));
