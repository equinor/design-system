import React from "react";
import { Chip as BaseChip } from "@/app/_components";
import { ChipProps } from "@/app/_components/ChipProps";

export const Chip: React.FC<ChipProps> = ({
  variant,
  label,
  className,
  icon,
}) => (
  <BaseChip
    // 💰 Use the chip variant property to specify
    // the data-color-appearance attribute
    // like this: data-color-appearance={variant}
    className={className}
    icon={icon}
  >
    {label}
  </BaseChip>
);
