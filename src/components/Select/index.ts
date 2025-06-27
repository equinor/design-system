import { Select as _Select, SelectProps } from "./Select";
import { Multiselect as _Multiselect, MultiselectProps } from "./Multiselect";

type SelectFamily = typeof _Select & {
    Multi: typeof _Multiselect;
};

const Select = _Select as SelectFamily;
Select.Multi = _Multiselect;

export { Select };
export type { SelectProps as SelectProps, MultiselectProps as MultiselectProps };
export type { SelectItem } from "./types";
