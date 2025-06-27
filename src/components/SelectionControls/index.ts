import { Switch as _Switch, SwitchProps } from "./Switch";
import { SmallSwitch, SmallSwitchProps } from "./SmallSwitch";
import { Radio, RadioProps } from "./Radio";

type SwitchFamily = typeof _Switch & {
    Small: typeof SmallSwitch;
};

const Switch = _Switch as SwitchFamily;
Switch.Small = SmallSwitch;

export { Switch, Radio };
export type { SwitchProps, SmallSwitchProps, RadioProps };
