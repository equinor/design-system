import { SpacerHorizontal } from "./SpacerHorizontal";
import { SpacerVertical } from "./SpacerVertical";
import { SpacerProps } from "./types";

export type ExtendedSpacer = typeof SpacerVertical & {
    Horizontal: typeof SpacerHorizontal;
};

const Spacer = SpacerVertical as ExtendedSpacer;
Spacer.Horizontal = SpacerHorizontal;

export { Spacer };
export type { SpacerProps };
