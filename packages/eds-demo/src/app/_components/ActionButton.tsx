import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  padding?: "xs" | "sm" | "md";
  ratio?: "squared";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({
  className,
  children,
  padding = "sm",
  ratio = "squared",
  ...rest
}: Props) => {
  return (
    <button
      type="button"
      className={`selectable select-none rounded-full justify-center items-center flex ${className}`}
      data-padding={padding}
      data-ratio={ratio}
      {...rest}
    >
      <div className="relative w-6 h-6">{children}</div>
    </button>
  );
};
