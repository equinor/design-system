import { colorToken } from "./colorToken";
import { layoutToken } from "./layoutToken";
import { MasterToken } from "./types";

export const masterToken: MasterToken = {
    colors: colorToken,
    ...layoutToken,
};
