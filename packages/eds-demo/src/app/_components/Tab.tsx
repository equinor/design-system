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
    // TODO: remove eslint-disable when proper navigation is implemented in demo
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      data-debug
      href="#"
      className={`h-11 px-4 py-2 justify-center items-center flex ${className}`}
      data-padding-inline="sm"
      data-padding-block="xs"
      // className={`h-11 bg-opacity-0 justify-center items-center flex ${className}`}
      {...rest}
    >
      <div className="text-base font-normal leading-tight">{children}</div>
    </a>
  );
}
