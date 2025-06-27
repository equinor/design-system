/* eslint-disable import/named */
import React from "react";
import {
    FallbackProps,
    ErrorBoundary as ReactErrorBoundary,
    ErrorBoundaryProps as ReactErrorBoundaryProps,
} from "react-error-boundary";
import { ErrorBoundaryScreen } from "./ErrorBoundaryScreen";

export type ErrorBoundaryProps = Pick<ReactErrorBoundaryProps, "onError" | "children">;

/**
 * If you care about dark mode, the error boundary should be within an EDS provider. However, for maximum safety, we recommend wrapping the whole app in this component.
 * You should also use the `onError` prop to track errors.
 * @param {ErrorBoundaryProps} props - children and onError
 */
export function ErrorBoundary({ children, onError }: ErrorBoundaryProps) {
    const fallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- any type comes from external library
        <ErrorBoundaryScreen error={error} resetErrorBoundary={resetErrorBoundary} />
    );
    return (
        <ReactErrorBoundary onError={onError} fallbackRender={fallbackRender}>
            {children}
        </ReactErrorBoundary>
    );
}
