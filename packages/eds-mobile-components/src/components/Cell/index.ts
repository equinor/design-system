import { CellGroup, CellGroupProps } from "./CellGroup";
import { NavigationCell, NavigationCellProps } from "./NavigationCell";
import { Cell as _Cell, CellProps } from "./Cell";
import { CellSwipeItemProps } from "./types";
import { ButtonCell, ButtonCellProps } from "./ButtonCell";
import { SwitchCell, SwitchCellProps } from "./SwitchCell";

type CellFamily = typeof _Cell & {
    /**
     * A container for grouping cells together. The child cells visually come together inside a group.
     */
    Group: typeof CellGroup;
    /**
     * A predefined cell covering most use cases for navigating.
     */
    Navigation: typeof NavigationCell;
    /**
     * A cell with button interaction.
     */
    Button: typeof ButtonCell;

    Switch: typeof SwitchCell;
};

const Cell = _Cell as CellFamily;
Cell.Group = CellGroup;
Cell.Navigation = NavigationCell;
Cell.Button = ButtonCell;
Cell.Switch = SwitchCell;

export { Cell };
export type {
    CellProps,
    CellGroupProps,
    NavigationCellProps,
    CellSwipeItemProps,
    SwitchCellProps,
    ButtonCellProps,
};
