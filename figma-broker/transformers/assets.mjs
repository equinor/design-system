import { getFigmaNamePath } from "../functions/utils";

export const makeAssets = assets =>
  assets.map(x => ({ ...getFigmaNamePath(x.name), value: x }));
