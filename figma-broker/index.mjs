#!/usr/bin/env NODE_NO_WARNINGS=1 node
import dotenv from "dotenv";
import Koa from "koa";
import KoaRouter from "koa-router";
import KoaLogger from "koa-logger";
import KoaBody from "koa-body";
import simplegit from "simple-git";
import rimraf from "rimraf";

import {
  fetchFigmaFile,
  processFigmaFile,
  fetchFigmaComponents,
  processFigmaComponents,
  processFigmaAssets,
  fetchFigmaImages
} from "./functions/figma";
import { createFolder } from "./functions/folder";
import { makeTokens } from "./functions/tokens";
import { writeTokens, writeComponents } from "./functions/file";
import { makeComponents } from "./transformers/components";
import { makeAssets, saveAssets } from "./functions/assets";

dotenv.config();

const PORT = process.env.PORT;
const TEAM_ID = "590517879490131675";

const app = new Koa();
const router = new KoaRouter();
const logger = new KoaLogger();

const PATHS = {
  TOKENS: "../common/tokens",
  ASSETS: "../common/assets",
  COMPONENTS: "../common/components"
};

router
  .post("/tokens", KoaBody(), createTokens)
  .get("/tokens", KoaBody(), getTokens)
  .post("/components", KoaBody(), createComponents)
  .post("/assets", KoaBody(), createAssets);

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
  const tokens = [{ name: "TODO 🙈" }];
  ctx.response.body = JSON.stringify(tokens);
}

// Components

async function createComponents(ctx) {
  const data = await fetchFigmaComponents(TEAM_ID);

  const figmaComponents = processFigmaComponents(data);
  const components = makeComponents(figmaComponents);

  writeComponents(components, PATHS.COMPONENTS);

  ctx.response.body = JSON.stringify(components);
}

// Assets

async function createAssets(ctx) {
  const assetsFileId = "BQjYMxdSdgRkdhKTDDU7L4KU";
  const data = await fetchFigmaFile(assetsFileId);

  const figmaAssets = processFigmaAssets(data);
  const assets = makeAssets(figmaAssets);

    assetsFileId,
    assets.map(x => x.value.id).toString()
  );

  const updatedAssets = assets.map(x => ({
    ...x,
    assetUrl: images[x.value.id]
  }));

  saveAssets(updatedAssets, PATHS.ASSETS);

  ctx.response.body = JSON.stringify(updatedAssets);
}

app.listen(PORT);

// eslint-disable-next-line no-console
console.info("Started Figma Broker 😄");
