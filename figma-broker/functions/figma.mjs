import { writeFile } from "./file.mjs";
import fetch from "node-fetch";

const options = () => ({
  headers: {
    "X-Figma-Token": process.env.FIGMA_TOKEN
  }
});
const isUnderConstrution = x => /^🚧/.test(x.name);

export const processFigmaFile = result =>
  result.document.children.filter(x => !isUnderConstrution(x));

export async function fetchFigmaFile(fileId) {
  let data = {};

  const url = "https://api.figma.com/v1/files/" + fileId;

  await fetch(url, options())
    .then(res => res.json())
    .then(json => {
      data = json;
      writeFile(
        JSON.stringify(json, null, 4),
        "design/figma",
        `file_${fileId}`,
        "json"
      );
    });
  return data;
}

export const processFigmaComponents = result =>
  result.error ? [] : result.meta.components;

export async function fetchFigmaComponents(teamId) {
  let data = {};

  const url = `https://api.figma.com/v1/teams/${teamId}/components`;

  await fetch(url, options())
    .then(res => res.json())
    .then(json => {
      data = json;
      writeFile(
        JSON.stringify(json, null, 4),
        "design/figma",
        `components_${teamId}`,
        "json"
      );
    });
  return data;
}

export const processFigmaAssets = result =>
  isUnderConstrution(result.document.children);

export async function fetchFigmaImages(fileId, ids) {
  let data = {};

  // https://www.figma.com/developers/docs#get-images-endpoint
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=svg`;

  await fetch(url, options())
    .then(res => res.json())
    .then(image => {
      data = image;
    });
  return data;
}

export async function fetchFile(url) {
  let data = {};
  await fetch(url, options()).then(res => (data = res.text()));
  return data;
}
