import { IconName } from "../Icon";

// Represents a single option within the select menu.
export type SelectItem<T> = {
    /**
     * The display text of the menu item.
     */
    title: string;
    /**
     * The value associated with the menuc item.
     */
    value: T;
    /**
     * Icon to display alongside the menu item's title.
     * Displayed to the left of the title.
     */
    icon?: IconName;
};

export type SelectBaseProps<T> = {
    /**
     * Array of menu item options from which the user can select.
     */
    items: SelectItem<T>[];
    /**
     * Placeholder text displayed when no item is selected.
     */
    placeholder?: string;
    /**
     * Placeholder text displayed when no item is selected.
     */
    disabled?: boolean;
    /**
     * If true, the select is read-only and cannot be interacted with. Functionality is similar as for disabled state, but the appearance is different.
     */
    readOnly?: boolean;
    /**
     * A variant to use for the validation of the input field.
     */
    variant?: "danger" | "warning" | "success";
};
