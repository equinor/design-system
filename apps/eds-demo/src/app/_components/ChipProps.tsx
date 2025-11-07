import { ChipVariant } from "./tableData";

export type ChipProps = {
  variant: ChipVariant;
  label: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  chipIconClass?: string;
  variantClassNames: {
    info?: string;
    warning?: string;
    danger?: string;
    success?: string;
  };
};
