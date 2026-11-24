import { ColorToken } from "./colorToken";
import { GeometryToken } from "./geometryToken";
import { SpacingToken } from "./spacingToken";
import { ThemeToken } from "./themeToken";
import { TimingToken } from "./timingToken";
import { TypographyToken } from "./typographyToken";

export type MasterToken = {
    colors: ColorToken;
    spacing: SpacingToken;
    typography: TypographyToken;
    geometry: GeometryToken;
    timing: TimingToken;
    /**
     * The tokens from the Tokens Studio export. They sit next to `colors`, `spacing` and
     * `typography` while the components move over, and replace them once the last one has.
     */
    theme: ThemeToken;
};
