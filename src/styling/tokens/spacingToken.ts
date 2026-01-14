import comfortableSpacingTokenJson from "@equinor/eds-tokens/build/json/spacing/nested/comfortable.json";
import spaciousSpacingTokenJson from "@equinor/eds-tokens/build/json/spacing/nested/spacious.json";

export const comfortableSpacingToken = comfortableSpacingTokenJson;
export const spaciousSpacingToken = spaciousSpacingTokenJson;

export type SpacingToken =
    | typeof comfortableSpacingToken
    | typeof spaciousSpacingToken;
