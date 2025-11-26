import { Typography } from "./Typography";

export function Chip({
  className,
  children,
  icon,
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`px-2 py-1 rounded-[100px] justify-center items-center gap-1 flex ${className}`}
      {...rest}
    >
      {icon && (
        <div className="flex items-center justify-center w-3 h-4 gap-1">
          <div className="relative w-4 h-4 icon">{icon}</div>
        </div>
      )}
      <Typography
        as="span"
        size="sm"
        baseline="center"
        style={{ marginTop: "1px" }}
      >
        {children}
      </Typography>
    </div>
  );
}
export function CheckmarkUnselected({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      data-color-appearance="accent"
      className={`w-[18px] h-[18px] left-[0px] top-[3px] absolute ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM6 19H18C18.55 19 19 18.55 19 18V6C19 5.45 18.55 5 18 5H6C5.45 5 5 5.45 5 6V18C5 18.55 5.45 19 6 19Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckmarkSelected({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      data-color-appearance="accent"
      className={`w-[18px] h-[18px] left-[0px] top-[3px] absolute ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L18.29 8.7C18.68 8.31 18.68 7.68 18.29 7.29C17.9 6.9 17.27 6.9 16.88 7.29L10 14.17L7.12 11.29C6.73 10.9 6.1 10.9 5.71 11.29C5.52275 11.4768 5.41751 11.7305 5.41751 11.995C5.41751 12.2595 5.52275 12.5132 5.71 12.7L9.3 16.29Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SideBarLink({
  children,
  className,
  popoverTarget,
  anchorName,
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
  popoverTarget?: string;
  anchorName?: string;
}) {
  return (
    <button
      data-debug
      type="button"
      popoverTarget={popoverTarget}
      className={`self-stretch h-14 px-5 justify-between items-center inline-flex ${className}`}
      style={
        anchorName
          ? ({ anchorName: `--${anchorName}` } as React.CSSProperties)
          : undefined
      }
      {...rest}
    >
      <div className="relative w-6 h-6">{children}</div>
    </button>
  );
}

export { Menu } from "./Menu";
export { Tab } from "./Tab";
