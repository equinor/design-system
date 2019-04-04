#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from "dotenv";
import Koa from "koa";
import KoaRouter from "koa-router";
import KoaLogger from "koa-logger";
import KoaBody from "koa-body";

import {
  fetchFigmaFile,
  processFigmaFile,
  fetchFigmaComponents,
  processFigmaComponents,
  processFigmaAssets,
  fetchFigmaImages,
} from "./functions/figma";
import { makeTokens, } from "./functions/tokens";
import {
  writeTokens,
  writeComponents,
  readTokens,
  writeFile,
} from "./functions/file";
import { makeComponents, } from "./transformers/components";
import { makeAssets, saveAssets, } from "./functions/assets";
import { jsonToSassString, } from "./transformers/jsonToSass";
import { jsonToCssString, } from "./transformers/jsonToCss";

dotenv.config();

const PORT = process.env.PORT;
const TEAM_ID = "590517879490131675";
const PATHS = {
  TOKENS: "../common/tokens",
  ASSETS: "../common/assets",
  COMPONENTS: "../common/components",
  SASS: "../common/public/sass",
  CSS: "../common/public/css",
};

const app = new Koa();
const router = new KoaRouter();
const logger = new KoaLogger();

router
  .post("/tokens", KoaBody(), createTokens)
  .get("/tokens", KoaBody(), getTokens)
  // .post("/components", KoaBody(), createComponents)
  .post("/assets", KoaBody(), createAssets)
  .post("/transform-tokens", KoaBody(), transformTokens);

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods());

// Tokens

async function createTokens(ctx) {
  const tokensFileId = "0TbIXrrObWj80Cf7KucKYFL0";
  const data = await fetchFigmaFile(tokensFileId);

  const figmaPages = processFigmaFile(data);
  const tokens = makeTokens(figmaPages);

  writeTokens(tokens, PATHS.TOKENS);

  ctx.response.body = JSON.stringify(tokens);
}

async function getTokens(ctx) {
  const tokens = [{ name: "TODO 🙈", },];
  ctx.response.body = JSON.stringify(tokens);
}

// Components

// async function createComponents(ctx) {
//   const data = await fetchFigmaComponents(TEAM_ID);

//   const figmaComponents = processFigmaComponents(data);
//   const components = makeComponents(figmaComponents);

//   writeComponents(components, PATHS.COMPONENTS);

//   ctx.response.body = JSON.stringify(components);
// }

// Assets

async function createAssets(ctx) {
  const assetsFileId = "BQjYMxdSdgRkdhKTDDU7L4KU";
  const data = await fetchFigmaFile(assetsFileId);

  const figmaAssets = processFigmaAssets(data);
  const assets = makeAssets(figmaAssets);

  const { images, } = await fetchFigmaImages(
    assetsFileId,
    assets.map(x => x.value.id).toString()
  );

  const updatedAssets = assets.map(x => ({
    ...x,
    assetUrl: images[x.value.id],
  }));

  saveAssets(updatedAssets, PATHS.ASSETS);

  ctx.response.body = JSON.stringify(updatedAssets);
}

// Transform tokens

async function transformTokens(ctx) {
  const tokens = readTokens(PATHS.TOKENS);
  const transformed = tokens.map(file => ({
    ...file,
    sassString: jsonToSassString(file.tokens),
    cssString: jsonToCssString(file.tokens),
  }));

  transformed.forEach(file => {
    writeFile(file.sassString, PATHS.SASS, file.fileName, "scss");
    writeFile(file.cssString, PATHS.CSS, file.fileName, "css");
  });

  ctx.response.body = JSON.stringify(transformed);
}

app.listen(PORT);

// eslint-disable-next-line no-console
console.info("Started Figma Broker 😄");
