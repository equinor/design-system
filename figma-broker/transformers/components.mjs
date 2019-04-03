import { getFigmaNamePath, } from "../functions/utils";

export const makeComponents = components =>
  components.map(x => ({ ...getFigmaNamePath(x.name), value: x, }));
