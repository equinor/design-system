import { ReactElement } from "react";

export type StrictChildrenReactNode<T> = ReactElement<T> | null | boolean | undefined;
