import React from "react";
import { SideBarLink } from ".";
import { ActionButton } from "./ActionButton";

type Props = {
  className?: string;
  linkClass?: string;
  activeLinkClass?: string;
  iconClass?: string;
  buttonClass?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Sidebar = ({
  className,
  linkClass,
  activeLinkClass,
  iconClass,
  buttonClass,
  ...rest
}: Props) => {
  return (
    <div className={className} {...rest}>
      <div className="flex flex-col items-start self-stretch justify-start h-56">
        <SideBarLink className={linkClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={iconClass}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3688 3.29L20.7088 5.63C21.0988 6.02 21.0988 6.65 20.7088 7.04L18.8788 8.87L15.1288 5.12L16.9588 3.29C17.1488 3.1 17.3988 3 17.6588 3C17.9188 3 18.1688 3.09 18.3688 3.29ZM2.99878 17.25V21H6.74878L17.8088 9.94L14.0588 6.19L2.99878 17.25ZM5.91878 19H4.99878V18.08L14.0588 9.02L14.9788 9.94L5.91878 19Z"
              fill="currentColor"
            />
          </svg>
        </SideBarLink>
        <SideBarLink
          data-color-appearance="accent"
          className={`${linkClass} ${activeLinkClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={iconClass}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 7H22V21H2V3H12V7ZM4 19H6V17H4V19ZM6 15H4V13H6V15ZM4 11H6V9H4V11ZM6 7H4V5H6V7ZM8 19H10V17H8V19ZM10 15H8V13H10V15ZM8 11H10V9H8V11ZM10 7H8V5H10V7ZM20 19V9H12V11H14V13H12V15H14V17H12V19H20ZM18 11H16V13H18V11ZM16 15H18V17H16V15Z"
              fill="currentColor"
            />
          </svg>
        </SideBarLink>
        <SideBarLink className={linkClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={iconClass}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2046 13.6361C14.1903 15.4663 14.4432 17.6722 14.3323 19.4421C14.2391 20.9312 13.8884 22.1116 13.5 22.5C14.2494 22.1541 15.2579 21.3896 16.2567 20.3512C18.1458 18.3872 20 15.4436 20 12.5C20 8.28368 16.1801 5.24272 13.2707 2.9266C13.0836 2.77769 12.9003 2.63178 12.722 2.48874C12.0561 1.95444 11.4603 1.46027 11 1C11 1.64522 10.6762 2.29044 10.1679 2.96053C9.6722 3.61399 9.00104 4.2911 8.28357 5.01492C6.31592 7 4 9.33644 4 12.5C4 15.5124 5.94188 18.3007 7.87574 20.265C8.83072 21.2351 9.78375 22.0041 10.5 22.5C10.2059 21.7353 9.90135 20.6071 9.77334 19.3245C9.59464 17.5341 9.75986 15.4427 10.7773 13.6183C11.0961 13.0469 11.4984 12.5016 12 12C12.0003 12.0003 12.0007 12.0007 12.001 12.001C12.4878 12.488 12.8848 13.0423 13.2046 13.6361ZM7.75146 17.0436C7.92157 14.8979 8.65974 12.5118 10.5858 10.5858L12 9.17157L13.4142 10.5858C15.2893 12.4609 16.0555 14.9861 16.2802 17.1692C17.3247 15.6487 18 13.9965 18 12.5C18 10.5812 16.8688 8.82557 15.0467 7.0622C14.1551 6.19943 13.1777 5.40964 12.2147 4.64234C12.1427 4.58501 12.0703 4.52742 11.9977 4.46963C11.9015 4.39314 11.8049 4.31628 11.7082 4.23916C11.6191 4.35436 11.5304 4.46402 11.4439 4.56793C10.926 5.19074 10.2577 5.86505 9.63299 6.49543C9.39134 6.73926 9.1562 6.97652 8.9388 7.20169C7.18561 9.0175 6 10.6241 6 12.5C6 13.9996 6.68012 15.5647 7.75146 17.0436Z"
              fill="currentColor"
            />
          </svg>
        </SideBarLink>
        <SideBarLink className={linkClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={iconClass}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4.915C13.09 3.635 14.76 2.825 16.5 2.825C19.58 2.825 22 5.245 22 8.325C22 12.1019 18.6056 15.1799 13.4627 19.8435L13.45 19.855L12 21.175L10.55 19.865L10.5105 19.8291C5.38263 15.1692 2 12.0953 2 8.325C2 5.245 4.42 2.825 7.5 2.825C9.24 2.825 10.91 3.635 12 4.915ZM12 18.475L12.1 18.375C16.86 14.065 20 11.215 20 8.325C20 6.325 18.5 4.825 16.5 4.825C14.96 4.825 13.46 5.815 12.94 7.185H11.07C10.54 5.815 9.04 4.825 7.5 4.825C5.5 4.825 4 6.325 4 8.325C4 11.215 7.14 14.065 11.9 18.375L12 18.475Z"
              fill="currentColor"
            />
          </svg>
        </SideBarLink>
      </div>
      <ActionButton
        className={`self-stretch h-14 w-14 px-5 rounded-full justify-between items-center flex ${buttonClass}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.56275 12L4 6.645L5.71255 5L13 12L5.71255 19L4 17.355L9.56275 12ZM16.5628 12L11 6.645L12.7126 5L20 12L12.7125 19L11 17.355L16.5628 12Z"
            fill="currentColor"
          />
        </svg>
      </ActionButton>
    </div>
  );
};
