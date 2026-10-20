import { StrictChildrenReactNode } from "../../utils/types";
import { TabProps } from "./Tab";

export type TabsContextType = {
    onPressTab: () => void;
    isSelected: boolean;
};

export type TabsChildrenType = StrictChildrenReactNode<TabProps>;
