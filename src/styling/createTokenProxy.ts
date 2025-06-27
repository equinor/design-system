import type {
    ColorScheme,
    ColorSchemeValues,
    Density,
    DensityValues,
    MasterToken,
    Token,
} from "./types";
import { masterToken } from "./masterToken";

function keyEquality(obj1: unknown, obj2: unknown) {
    if (!obj1 || !obj2) return false;
    if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
    const obj1Keys = Object.keys(obj1).sort();
    const obj2Keys = Object.keys(obj2).sort();
    return JSON.stringify(obj1Keys) === JSON.stringify(obj2Keys);
}

function isColorSchemeValuesObject(obj: unknown): obj is ColorSchemeValues<unknown> {
    const template: ColorSchemeValues<unknown> = {
        light: undefined as unknown,
        dark: undefined as unknown,
    };
    return keyEquality(obj, template);
}

function isDensityValuesObject(obj: unknown): obj is DensityValues<unknown> {
    const template: DensityValues<unknown> = {
        tablet: undefined as unknown,
        phone: undefined as unknown,
    };
    return keyEquality(obj, template);
}

/**
 * Given a color scheme and a density value,
 * this method creates proxies for the master token so that it resolves to the correct theme values.
 * @param scheme The color scheme of the application.
 * @param density The density scheme of the application
 * @returns A proxied master token with all values resolved to the provided schemes.
 */
export function createTokenProxy(scheme: ColorScheme, density: Density): Token {
    const handler: ProxyHandler<object> = {
        get: function (target, property, receiver) {
            const value: unknown = Reflect.get(target, property, receiver);

            if (typeof value === "object" && !Array.isArray(value) && !!value) {
                if (isColorSchemeValuesObject(value) || isDensityValuesObject(value)) {
                    return (
                        (value as ColorSchemeValues<unknown>)[scheme] ??
                        (value as DensityValues<unknown>)[density]
                    );
                }
                return new Proxy(value, handler);
            }
            return value;
        },
    };
    return new Proxy<MasterToken>(masterToken, handler) as unknown as Token;
}
