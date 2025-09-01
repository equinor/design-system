import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLDivElement>;

export const ActionButton = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={`cursor-default select-none w-11 h-11 rounded-full justify-center items-center flex ${className}`}
      {...rest}
    >
      <div className="relative w-6 h-6">{children}</div>
    </div>
  );
};
