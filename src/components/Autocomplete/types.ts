type AutocompleteTransformItemProp<T> = T extends string
    ? { transformItem?: (item: T) => string }
    : { transformItem: (item: T) => string };

export type GenericAutocompleteProps<T> = {
    options: T[];
} & AutocompleteTransformItemProp<T>;
