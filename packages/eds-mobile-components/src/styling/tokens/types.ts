import { ColorToken } from "./colorToken";
import { GeometryToken } from "./geometryToken";
import { SpacingToken } from "./spacingToken";
import { TimingToken } from "./timingToken";
import { TypographyToken } from "./typographyToken";

export type MasterToken = {
    colors: ColorToken;
    spacing: SpacingToken;
    typography: TypographyToken;
    geometry: GeometryToken;
    timing: TimingToken;
};
