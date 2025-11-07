/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Chip as BaseChip } from "@/app/_components";
import { ChipProps } from "@/app/_components/ChipProps";

export const Chip: React.FC<ChipProps> = ({
  variant,
  variantClassNames,
  label,
  className,
  icon,
}) => (
  <BaseChip
    // 💰 Use the chip variant property to specify
    // the chip variant style using className
    // like this: variantClassNames[variant]
    // TODO: remove eslint-disable when proper type definitions are available
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    className={variantClassNames[variant]}
    icon={icon}
  >
    {label}
  </BaseChip>
);
