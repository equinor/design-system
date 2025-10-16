import React from "react";

type ButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  ratio?: "squished" | "squared" | "stretched";
  padding?: "xs" | "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({
  className,
  icon,
  onClick,
  children,
  ratio = "squished",
  padding = "sm",
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`selectable select-none rounded border-opacity-0 ${
        className || ""
      }`}
      data-padding={padding}
      data-ratio={ratio}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <div className="text-sm leading-none">{children}</div>
    </button>
  );
};

export const SecondaryButton = ({
  className,
  icon,
  onClick,
  children,
  ratio = "squished",
  padding = "sm",
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`selectable select-none bg-opacity-0 rounded border ${
        className || ""
      }`}
      data-padding={padding}
      data-ratio={ratio}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <div className="text-sm leading-none">{children}</div>
    </button>
  );
};
