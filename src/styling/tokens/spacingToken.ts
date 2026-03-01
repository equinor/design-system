import { spacing as comfortableSpacingToken } from "@equinor/eds-tokens/build/ts/spacing/comfortable";
import { spacing as spaciousSpacingToken } from "@equinor/eds-tokens/build/ts/spacing/spacious";

export { comfortableSpacingToken, spaciousSpacingToken };

export type SpacingToken =
    | typeof comfortableSpacingToken
    | typeof spaciousSpacingToken;
