import React from "react";

type ButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({
  className,
  icon,
  onClick,
  children = "Save",
  ...rest
}: ButtonProps) => {
  return (
    <button
      data-debug
      type="button"
      className={`select-none h-[36px] px-4 py-2.5 rounded border-opacity-0 justify-start gap-2 flex items-center button button--primary ${
        className || ""
      }`}
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
  children = "Cancel",
  ...rest
}: ButtonProps) => {
  return (
    <button
      data-debug
      type="button"
      className={`select-none h-[36px] px-4 py-2.5 bg-opacity-0 rounded border justify-start gap-2 flex items-center ${
        className || ""
      }`}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <div className="text-sm leading-none">{children}</div>
    </button>
  );
};
