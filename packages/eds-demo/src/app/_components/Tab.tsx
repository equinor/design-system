import React from "react";

export function Tab({
  children,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      data-debug
      href=""
      data-padding-inline="sm"
      data-padding-block="xs"
      className={`h-11 bg-opacity-0 justify-center items-center flex ${className}`}
      {...rest}
    >
      <div className="text-base font-normal leading-tight">{children}</div>
    </a>
  );
}
