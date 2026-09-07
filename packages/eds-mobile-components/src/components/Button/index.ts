import { Button as _Button, ButtonProps } from "./Button";
import { IconButton, IconButtonProps } from "./IconButton";

type ExtendedButton = typeof _Button & {
    /**
     * A small icon-only variant of the button.
     */
    Icon: typeof IconButton;
};

const Button = _Button as ExtendedButton;
Button.Icon = IconButton;

export { Button };
export type { ButtonProps, IconButtonProps };
