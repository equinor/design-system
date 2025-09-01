import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup = ({ className, children, ...rest }: Props) => {
  return (
    <div className={`${className || ""} inline-flex gap-4`} {...rest}>
      {children}
    </div>
  );
};
