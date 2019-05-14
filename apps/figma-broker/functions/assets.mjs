import { makeAssets as makeAssets_, } from "../transformers/assets";
import { fetchFile, } from "./figma";
import { writeFile, } from "./file.mjs";

const fixPageName = name =>
  name
    .replace(/(🚧*)(✅*)/, "")
    .toLowerCase()
    .trim();

export const makeAssets = figmaAssets => {
  const assets = [];

  figmaAssets.forEach(page => {
    const fixedPageName = fixPageName(page.name);

    if (fixedPageName === "system icons") {
      const data = page.children.filter(x => x.type === "COMPONENT");
      assets.push(...makeAssets_(data));
    }
  });

  return assets;
};

export async function saveAssets(assets, savePath) {
  assets.forEach(async function({ name, path, assetUrl, }) {
    const asset = await fetchFile(assetUrl);
    writeFile(asset, `${savePath}/${path}`, name, "svg");
  });
}
