"use client";

import React from "react";

type MenuItemProps = {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  activeClassName?: string;
};

const MenuItem = ({
  children,
  active,
  className,
  activeClassName,
}: MenuItemProps) => {
  return (
    <div
      data-debug
      className={`box-border content-stretch flex flex-col items-start px-[20px] py-[16px] relative shrink-0 w-full ${active ? activeClassName : className}`}
    >
      <div className="box-border content-stretch flex items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
        <p className="font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre">
          {children}
        </p>
      </div>
    </div>
  );
};

type MenuProps = {
  id: string;
  anchorName: string;
  className?: string;
  menuItemClassName?: string;
  menuItemActiveClassName?: string;
};

export const Menu = ({
  id,
  anchorName,
  className,
  menuItemClassName,
  menuItemActiveClassName,
}: MenuProps) => {
  return (
    <div
      id={id}
      popover="auto"
      className={`${className} box-border px-0 py-[4px] rounded-[4px] shadow-[0px_12px_17px_0px_rgba(0,0,0,0.14),0px_5px_22px_0px_rgba(0,0,0,0.12),0px_7px_8px_0px_rgba(0,0,0,0.2)] m-0 min-w-[120px] [&:popover-open]:flex [&:popover-open]:flex-col [&:popover-open]:items-start`}
      style={
        {
          positionAnchor: `--${anchorName}`,
          top: "anchor(top)",
          left: "anchor(right)",
          marginLeft: "8px",
        } as React.CSSProperties
      }
    >
      <MenuItem
        className={menuItemClassName}
        activeClassName={menuItemActiveClassName}
      >
        Tools
      </MenuItem>
      <MenuItem
        active
        className={menuItemClassName}
        activeClassName={menuItemActiveClassName}
      >
        Fields
      </MenuItem>
      <MenuItem
        className={menuItemClassName}
        activeClassName={menuItemActiveClassName}
      >
        Reports
      </MenuItem>
      <MenuItem
        className={menuItemClassName}
        activeClassName={menuItemActiveClassName}
      >
        Archived
      </MenuItem>
    </div>
  );
};
