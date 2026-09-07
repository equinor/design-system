import { TabsProps, Tabs as _Tabs } from "./Tabs";
import { Tab, TabProps } from "./Tab";

type TabsFamily = typeof _Tabs & {
    /**
     * A single tab component. Use this inside a {@link Tabs} component.
     */
    Tab: typeof Tab;
};

const Tabs = _Tabs as TabsFamily;
Tabs.Tab = Tab;

export { Tabs };
export type { TabsProps, TabProps as TabItemProps };
