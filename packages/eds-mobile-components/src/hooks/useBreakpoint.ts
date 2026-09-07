import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

export type Breakpoint = keyof typeof breakpoints;

const getBreakpoint = (width: number): Breakpoint => {
    if (width < breakpoints.sm) return "xs";
    if (width < breakpoints.md) return "sm";
    if (width < breakpoints.lg) return "md";
    if (width < breakpoints.xl) return "lg";
    if (width < breakpoints["2xl"]) return "xl";
    return "2xl";
};

export const useBreakpoint = () => {
    const { width } = useWindowDimensions();
    return useMemo(() => getBreakpoint(width), [width]);
};
