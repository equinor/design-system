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
      href=""
      className={`h-11 px-4 py-2 justify-center items-center flex ${className}`}
      {...rest}
    >
      <div className="text-base font-normal leading-tight">{children}</div>
    </a>
  );
}
