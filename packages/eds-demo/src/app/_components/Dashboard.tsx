import { ComponentType } from "react";
import { TopBar } from "@/app/_components/TopBar";
import { Sidebar } from "@/app/_components/Sidebar";
import { TabBar } from "@/app/_components/TabBar";
import { DataTable } from "@/app/_components/DataTable";
import { PrimaryButton, SecondaryButton } from "@/app/_components/Button";
import { ButtonGroup } from "@/app/_components/ButtonGroup";
import { ChipProps } from "@/app/_components/ChipProps";
import { Menu } from "@/app/_components/Menu";
import { Heading } from "./Typography";

type Props = {
  styles: Readonly<{ [key: string]: string }>;
  Chip: ComponentType<ChipProps>;
};

export function Dashboard({ styles, Chip, ...rest }: Props) {
  const tabs = [
    { id: "projects", label: "Projects", isCurrent: false },
    { id: "people", label: "People", isCurrent: true },
    { id: "locations", label: "Locations", isCurrent: false },
  ];

  return (
    <div
      className={`flex mx-auto min-h-svh flex-col ${styles.dashboard}`}
      {...rest}
    >
      <TopBar
        className={`self-stretch h-[57px] pl-2.5 pr-3.5 items-center justify-between gap-14 inline-flex ${styles["top-bar"]}`}
        subtitle="Application name – Subtitle"
        subtitleClass={styles["subtitle"]}
        textInputClass={styles["text-input"]}
      />

      <div className="self-stretch grow shrink basis-0 justify-start items-end gap-0.5 inline-flex">
        <Sidebar
          className={`w-16 self-stretch flex-col justify-between items-start inline-flex ${styles["sidebar"]}`}
          linkClass={styles["sidebar-link"]}
          activeLinkClass={styles["sidebar-link--active"]}
          iconClass={styles["sidebar-link__icon"]}
          buttonClass={styles["button--ghost-icon"]}
        />
        <Menu
          id="sidebar-menu"
          anchorName="sidebar-menu-anchor"
          className={styles["menu"]}
          menuItemClassName={styles["menu-item"]}
          menuItemActiveClassName={styles["menu-item--active"]}
        />

        <main className="inline-flex flex-col items-start self-stretch justify-start gap-6 p-8 grow shrink basis-0">
          <TabBar
            className="justify-start items-start flex"
            tabs={tabs}
            tabClass={styles.tab}
            currentTabClass={styles["tab--current"]}
          />

          <header className="self-stretch h-9 pt-[5px] pb-[3px] flex-col justify-start items-start flex">
            <Heading
              level={1}
              size="5xl"
              isBaselineAligned={false}
              className={styles.heading}
            >
              People
            </Heading>
          </header>

          <DataTable
            className={`w-full table-fixed ${styles["table"]}`}
            trClass={styles["tr"]}
            thClass={styles["th"]}
            activeThClass={styles["th--active"]}
            tdClass={styles["td"]}
            trActiveClass={styles["tr--active"]}
            checkmarkClass={styles.checkmark}
            Chip={Chip}
            chipClass={styles.chip}
            chipIconClass={styles["chip__icon"]}
            chipInfoClass={styles["chip--info"]}
            chipWarningClass={styles["chip--warning"]}
            chipDangerClass={styles["chip--danger"]}
            chipSuccessClass={styles["chip--success"]}
          />
          <ButtonGroup
            className="inline-flex items-center self-stretch justify-end h-9"
            // 💰 Add the data-color-appearance attribute to add colour
            data-color-appearance="accent"
          >
            <PrimaryButton
              className={styles["button--primary"]}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 3H17L21 7V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3ZM19 19V7.83L16.17 5H5V19H19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM15 6H6V10H15V6Z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              Save
            </PrimaryButton>
            <SecondaryButton className={styles["button--secondary"]}>
              Cancel
            </SecondaryButton>
          </ButtonGroup>
        </main>
      </div>
    </div>
  );
}
