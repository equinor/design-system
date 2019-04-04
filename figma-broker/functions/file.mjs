import fs from "fs";
import { createFolder, } from "./folder";

const getFilePath = (path, name, ext) => `${path}/${name}.${ext}`;

const write = (file, path, name, ext) => {
  const filePath = getFilePath(path, name, ext);
  fs.writeFile(filePath, file, "utf-8", error => {
    if (error) {
      throw new Error("Error in write(): ", { error, filePath, });
    }
  });
};

export const writeFile = (file, path, name, ext) => {
  if (file && path && name) {
    createFolder(path);
    write(file, path, name, ext);
  } else {
    throw new Error(
      "Missing required parameters to correctly run writeFile()!"
    );
  }
};

export const readFile = (path, name, ext, callback) => {
  fs.readFile(getFilePath(path, name, ext), (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch (exception) {
      callback(exception);
    }
  });
};

export const writeTokens = (tokens, savePath) =>
  tokens.forEach(({ value, name, }) =>
    writeFile(JSON.stringify(value, null, 4), savePath, name, "json")
  );

export const writeComponents = (components, savePath) =>
  components.forEach(({ value, name, path, }) =>
    writeFile(
      JSON.stringify(value, null, 4),
      `${savePath}/${path}`,
      name,
      "json"
    )
  );

export const readTokens = path =>
  fs.readdirSync(path).map(fileName => ({
    fileName,
    data: JSON.parse(fs.readFileSync(`${path}/${fileName}`)),
  }));
