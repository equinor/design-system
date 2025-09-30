import React from "react";
import { SearchInput } from "./SearchInput";
import { ActionButton } from "./ActionButton";
import { Typography } from "./Typography";

type Props = {
  subtitle: string;
  subtitleClass: string;
  textInputClass: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const TopBar = ({
  subtitle,
  className,
  subtitleClass,
  textInputClass,
  ...rest
}: Props) => {
  return (
    <header className={className} {...rest}>
      <div className="w-[243px] justify-start items-center gap-1 flex">
        <ActionButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 8.5H8V4.5H4V8.5ZM10 20.5H14V16.5H10V20.5ZM8 20.5H4V16.5H8V20.5ZM4 14.5H8V10.5H4V14.5ZM14 14.5H10V10.5H14V14.5ZM16 4.5V8.5H20V4.5H16ZM14 8.5H10V4.5H14V8.5ZM16 14.5H20V10.5H16V14.5ZM20 20.5H16V16.5H20V20.5Z"
              fill="currentColor"
            />
          </svg>
        </ActionButton>
        <Typography
          as="span"
          size="lg"
          baselineAligned={false}
          weight="normal"
          className={subtitleClass}
        >
          {subtitle}
        </Typography>
      </div>
      <div className="flex align-middle items-center">
        <SearchInput className={textInputClass} />
        <nav
          aria-label="Header navigation"
          className="justify-start items-start gap-2 flex top-bar__actions"
        >
          <ActionButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 10.5H5V5.5H10V7.5H7V10.5ZM5 14.5H7V17.5H10V19.5H5V14.5ZM17 17.5H14V19.5H19V14.5H17V17.5ZM14 7.5V5.5H19V10.5H17V7.5H14Z"
                fill="currentColor"
              />
            </svg>
          </ActionButton>
          <ActionButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 16.25V11.25C18 8.18 16.37 5.61 13.5 4.93V4.25C13.5 3.42 12.83 2.75 12 2.75C11.17 2.75 10.5 3.42 10.5 4.25V4.93C7.64 5.61 6 8.17 6 11.25V16.25L4 18.25V19.25H20V18.25L18 16.25ZM12 22.25C13.1 22.25 14 21.35 14 20.25H10C10 21.35 10.9 22.25 12 22.25ZM8 17.25H16V11.25C16 8.77 14.49 6.75 12 6.75C9.51 6.75 8 8.77 8 11.25V17.25Z"
                fill="currentColor"
              />
            </svg>
          </ActionButton>
          <ActionButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 4.5C14 5.6 13.1 6.5 12 6.5C10.9 6.5 10 5.6 10 4.5C10 3.4 10.9 2.5 12 2.5C13.1 2.5 14 3.4 14 4.5ZM12 7.5C14.83 7.5 17.89 7.2 20.5 6.5L21 8.5C19.14 9 17 9.33 15 9.5V22.5H13V16.5H11V22.5H9V9.5C7 9.33 4.86 9 3 8.5L3.5 6.5C6.11 7.2 9.17 7.5 12 7.5Z"
                fill="currentColor"
              />
            </svg>
          </ActionButton>
          <ActionButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 8.5H8V4.5H4V8.5ZM10 20.5H14V16.5H10V20.5ZM8 20.5H4V16.5H8V20.5ZM4 14.5H8V10.5H4V14.5ZM14 14.5H10V10.5H14V14.5ZM16 4.5V8.5H20V4.5H16ZM14 8.5H10V4.5H14V8.5ZM16 14.5H20V10.5H16V14.5ZM20 20.5H16V16.5H20V20.5Z"
                fill="currentColor"
              />
            </svg>
          </ActionButton>
          <ActionButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5ZM7.07 18.78C7.5 17.88 10.12 17 12 17C13.88 17 16.51 17.88 16.93 18.78C15.57 19.86 13.86 20.5 12 20.5C10.14 20.5 8.43 19.86 7.07 18.78ZM12 15C13.46 15 16.93 15.59 18.36 17.33C19.38 15.99 20 14.32 20 12.5C20 8.09 16.41 4.5 12 4.5C7.59 4.5 4 8.09 4 12.5C4 14.32 4.62 15.99 5.64 17.33C7.07 15.59 10.54 15 12 15ZM12 6.5C10.06 6.5 8.5 8.06 8.5 10C8.5 11.94 10.06 13.5 12 13.5C13.94 13.5 15.5 11.94 15.5 10C15.5 8.06 13.94 6.5 12 6.5ZM10.5 10C10.5 10.83 11.17 11.5 12 11.5C12.83 11.5 13.5 10.83 13.5 10C13.5 9.17 12.83 8.5 12 8.5C11.17 8.5 10.5 9.17 10.5 10Z"
                fill="currentColor"
              />
            </svg>
          </ActionButton>
        </nav>
      </div>
    </header>
  );
};
