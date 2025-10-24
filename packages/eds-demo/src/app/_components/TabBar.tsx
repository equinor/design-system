import React from "react";
import { Tab } from "./Tab";

type TabItem = {
  id: string;
  label: string;
  isCurrent?: boolean;
};

type Props = {
  tabs: TabItem[];
  className?: string;
  tabClass?: string;
  currentTabClass?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const TabBar = ({
  tabs,
  className,
  tabClass,
  currentTabClass,
  ...rest
}: Props) => {
  return (
    <nav aria-label="Content navigation" className={className} {...rest}>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          className={`${tabClass} ${tab.isCurrent ? currentTabClass : ""}`}
          data-color-appearance={tab.isCurrent ? "accent" : "neutral"}
        >
          {tab.label}
        </Tab>
      ))}
    </nav>
  );
};
