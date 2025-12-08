import React from "react";
import { TypographyNext as Typography } from "@equinor/eds-core-react";

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
      className={`select-none h-[36px] px-4 rounded border-opacity-0 justify-center gap-2 flex items-center button button--primary ${
        className || ""
      }`}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <Typography
        as="span"
        family="ui"
        size="md"
        baseline="center"
        lineHeight="default"
        weight="normal"
        tracking="normal"
      >
        {children}
      </Typography>
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
      className={`select-none h-[36px] px-4 bg-opacity-0 rounded border justify-start gap-2 flex items-center ${
        className || ""
      }`}
      onClick={onClick}
      {...rest}
    >
      {icon}
      <Typography
        as="span"
        family="ui"
        size="md"
        baseline="center"
        lineHeight="default"
        weight="normal"
        tracking="normal"
      >
        {children}
      </Typography>
    </button>
  );
};
