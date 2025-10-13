import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({ className, children, ...rest }: Props) => {
  return (
    <button
      data-debug
      type="button"
      className={`select-none w-11 h-11 rounded-full justify-center items-center flex ${className}`}
      {...rest}
    >
      <div className="relative w-6 h-6">{children}</div>
    </button>
  );
};
