import React from "react";
import { Typography } from "./Typography";

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
      // className={`select-none h-[36px] px-4 rounded border-opacity-0 justify-center gap-2 flex items-center button button--primary ${
      className={`selectable select-none rounded border-opacity-0 ${
        className || ""
      }`}
      data-padding={padding}
      data-ratio={ratio}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <Typography as="span" size="md" isBaselineAligned={false}>
        {children}
      </Typography>
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
      // className={`select-none h-[36px] px-4 bg-opacity-0 rounded border justify-start gap-2 flex items-center ${
      className={`selectable select-none bg-opacity-0 rounded border ${
        className || ""
      }`}
      data-padding={padding}
      data-ratio={ratio}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <Typography as="span" size="md" isBaselineAligned={false}>
        {children}
      </Typography>
    </button>
  );
};
