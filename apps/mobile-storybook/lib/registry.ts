/**
 * The single list of component demo screens.
 *
 * The Components home list and the screen titles are both built from this
 * file. To add a component, create `app/(tabs)/components/<route>.tsx` and
 * add one entry here.
 *
 * `route` is the screen file name without extension and must be the
 * lowercased name of the component's folder in `eds-mobile-components`.
 */

export type ComponentGroup =
    | "Actions"
    | "Data Display"
    | "Data Entry"
    | "Navigation";

export type ComponentEntry = {
    /** Label in the Components list and title in the screen header. */
    name: string;
    /** Screen file name under `app/(tabs)/components/`. */
    route: string;
    group: ComponentGroup;
};

export const componentRegistry: ComponentEntry[] = [
    { name: "Button", route: "button", group: "Actions" },
    { name: "Badge", route: "badge", group: "Data Display" },
    { name: "Divider", route: "divider", group: "Data Display" },
    { name: "Typography", route: "typography", group: "Data Display" },
    { name: "Input", route: "input", group: "Data Entry" },
    { name: "Search", route: "search", group: "Data Entry" },
    {
        name: "Selection Controls",
        route: "selectioncontrols",
        group: "Data Entry",
    },
    { name: "TextArea", route: "textarea", group: "Data Entry" },
    { name: "TextField", route: "textfield", group: "Data Entry" },
    { name: "Link", route: "link", group: "Navigation" },
];

const groupOrder: ComponentGroup[] = [
    "Actions",
    "Data Display",
    "Data Entry",
    "Navigation",
];

/** Registry entries grouped for the Components list, in display order. */
export const componentSections = groupOrder.map((title) => ({
    title,
    data: componentRegistry.filter((entry) => entry.group === title),
}));

/** Screen header title for a route, or undefined for unregistered routes. */
export function getComponentTitle(route: string): string | undefined {
    return componentRegistry.find((entry) => entry.route === route)?.name;
}
