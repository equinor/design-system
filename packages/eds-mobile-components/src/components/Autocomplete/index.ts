import { Autocomplete as _Autocomplete } from "./Autocomplete";
import { MultiselectAutocomplete as _MultiselectAutocomplete } from "./MultiselectAutocomplete";

type AutocompleteFamily = typeof _Autocomplete & {
    Multiselect: typeof _MultiselectAutocomplete;
};

const Autocomplete = _Autocomplete as AutocompleteFamily;
Autocomplete.Multiselect = _MultiselectAutocomplete;

export { Autocomplete };
