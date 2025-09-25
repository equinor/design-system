import React from "react";

type Props = {
  className?: string;
  iconClass?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = ({ className, iconClass, ...rest }: Props) => {
  return (
    <form>
      <div className="relative inline-block">
        <span className="absolute top-1/2 left-2 transform -translate-y-1/2 w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            className={iconClass}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.965 14.755H15.755L20.745 19.755L19.255 21.245L14.255 16.255V15.465L13.985 15.185C12.845 16.165 11.365 16.755 9.755 16.755C6.165 16.755 3.255 13.845 3.255 10.255C3.255 6.665 6.165 3.755 9.755 3.755C13.345 3.755 16.255 6.665 16.255 10.255C16.255 11.865 15.665 13.345 14.685 14.485L14.965 14.755ZM5.255 10.255C5.255 12.745 7.265 14.755 9.755 14.755C12.245 14.755 14.255 12.745 14.255 10.255C14.255 7.76501 12.245 5.755 9.755 5.755C7.265 5.755 5.255 7.76501 5.255 10.255Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search"
          className={`max-w-[250px] w-[250px] h-[37px] px-3 py-2 pl-10 justify-start items-center gap-3 flex text-base font-normal leading-tight ${className}`}
          {...rest}
        />
      </div>
    </form>
  );
};
