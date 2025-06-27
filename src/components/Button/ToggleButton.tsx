import React, { createContext } from "react";
import { ViewProps } from "react-native";
import { useValidChildren } from "../../hooks/useValidChildren";
import { StrictChildrenReactNode } from "../../utils/types";
import { ButtonGroup, ButtonGroupProps } from "./ButtonGroup";

export type ToggleButtonProps = {
    /**
     * Index of the selected button.
     */
    activeIndex: number;
};

export type ToggleButtonContextType =
    | {
          /**
           * Boolean value indicating whether or not the contexed button is selected or not.
           */
          isSelected: boolean;
      }
    | undefined;

export const ToggleButtonContext = createContext<ToggleButtonContextType>(undefined);

export const ToggleButton = ({ activeIndex, children }: ToggleButtonProps & ViewProps) => {
    const validChildren = useValidChildren(children) as StrictChildrenReactNode<ButtonGroupProps>[];
    return (
        <ButtonGroup>
            {validChildren.map((child, index) => {
                return (
                    <ToggleButtonContext.Provider
                        key={index}
                        value={{
                            isSelected: activeIndex === index,
                        }}
                    >
                        {child}
                    </ToggleButtonContext.Provider>
                );
            })}
        </ButtonGroup>
    );
};

ToggleButton.displayName = "Button.Toggle";
