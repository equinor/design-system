import { spacing as comfortableSpacingToken } from "@equinor/eds-tokens/ts/spacing/comfortable";
import { spacing as spaciousSpacingToken } from "@equinor/eds-tokens/ts/spacing/spacious";

export { comfortableSpacingToken, spaciousSpacingToken };

export type SpacingToken =
    | typeof comfortableSpacingToken
    | typeof spaciousSpacingToken;
