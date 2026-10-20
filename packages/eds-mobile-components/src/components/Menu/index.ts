import { Menu as _Menu, MenuProps } from "./Menu";
import { MenuItem, MenuItemProps } from "./MenuItem";

type MenuFamily = typeof _Menu & {
    Item: typeof MenuItem;
};

const Menu = _Menu as MenuFamily;
Menu.Item = MenuItem;

export { Menu };
export type { MenuProps, MenuItemProps };
