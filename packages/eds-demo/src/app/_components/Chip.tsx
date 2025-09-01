import React from "react";
import { Chip as BaseChip } from ".";
import { ChipProps } from "./ChipProps";

export const Chip: React.FC<ChipProps> = ({
  variant,
  label,
  className,
  icon,
  variantClassNames,
  children,
}) => {
  return (
    <BaseChip
      // 💰 Use the chip variant property to specify the data-color-appearance attribute
      data-color-appearance={variant}
      // 💰 Use the className prop to apply additional styles
      className={`${className} ${variantClassNames?.[variant]}`}
      icon={icon}
    >
      {label}
      {children}
    </BaseChip>
  );
};
