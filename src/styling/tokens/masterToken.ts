import { colorToken } from "../colorToken";
import { layoutToken } from "./layoutToken";
import { ProxyableMasterToken } from "./types";

export const proxyableMasterToken: ProxyableMasterToken = {
    colors: colorToken,
    ...layoutToken,
};
