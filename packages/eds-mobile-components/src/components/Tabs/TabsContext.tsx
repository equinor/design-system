import { createContext } from "react";
import { TabsContextType } from "./types";

export const TabsContext = createContext<TabsContextType>({
    onPressTab: () => null,
    isSelected: false,
});
