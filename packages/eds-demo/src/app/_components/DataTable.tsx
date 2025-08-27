import React, { ComponentType } from "react";
import {
  TableHeader,
  TableDataCell,
  TableRow,
  CheckmarkSelected,
  CheckmarkUnselected,
} from ".";
import { InfoIcon, SuccessIcon, WarningIcon, ErrorIcon } from "./ChipIcons";
import { tableData } from "./tableData";
import { ChipProps } from "./ChipProps";

type Props = {
  className?: string;
  thClass: string;
  activeThClass?: string;
  tdClass: string;
  trActiveClass: string;
  checkmarkClass?: string;
  Chip: ComponentType<ChipProps>;
  chipClass?: string;
  chipIconClass?: string;
  chipInfoClass?: string;
  chipWarningClass?: string;
  chipDangerClass?: string;
  chipSuccessClass?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const DataTable = ({
  className,
  thClass,
  activeThClass,
  tdClass,
  trActiveClass,
  checkmarkClass,
  Chip,
  chipClass,
  chipIconClass,
  chipInfoClass,
  chipWarningClass,
  chipDangerClass,
  chipSuccessClass,
  ...rest
}: Props) => {
  const columns = [
    { id: "checkbox", label: "", active: false },
    { id: "id", label: "ID", active: false },
    { id: "person", label: "Person", active: true },
    { id: "position", label: "Position", active: false },
    { id: "location", label: "Location", active: false },
    { id: "status", label: "Status", active: false },
  ];

  const getChipIcon = (type: string) => {
    const iconMap = {
      info: <InfoIcon className={chipIconClass} />,
      success: <SuccessIcon className={chipIconClass} />,
      warning: <WarningIcon className={chipIconClass} />,
      danger: <ErrorIcon className={chipIconClass} />,
    };
    return iconMap[type as keyof typeof iconMap];
  };

  return (
    <div className={className} {...rest}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={`${
            column.id !== "checkbox" ? "grow" : ""
          } inline-flex flex-col items-start justify-start  shrink basis-0`}
        >
          <TableHeader
            data-color-appearance={column.active ? "accent" : undefined}
            className={`${thClass} ${column.active ? activeThClass : ""}`}
          >
            {column.id === "checkbox" ? (
              <div className="w-[18px] h-[18px] justify-start items-center gap-1 flex">
                <div className="relative w-6 h-6">
                  <CheckmarkUnselected className={checkmarkClass} />
                </div>
              </div>
            ) : (
              column.label
            )}
          </TableHeader>

          {/* Render table data for each row */}
          {tableData.map((row, rowIndex) => {
            return (
              <TableRow
                key={`row-${rowIndex}`}
                className={`${row.active ? trActiveClass : ""}`}
              >
                <TableDataCell className={tdClass}>
                  {column.id === "checkbox" && (
                    <div className="w-[18px] h-[18px] justify-start items-center gap-1 flex">
                      <div className="relative w-6 h-6">
                        {row.selected ? (
                          <CheckmarkSelected className={checkmarkClass} />
                        ) : (
                          <CheckmarkUnselected className={checkmarkClass} />
                        )}
                      </div>
                    </div>
                  )}

                  {column.id === "id" && (
                    <div className="h-5 text-sm leading-tight grow shrink basis-0">
                      {row.id}
                    </div>
                  )}

                  {column.id === "person" && (
                    <div className="inline-flex flex-col items-start justify-center h-8 grow shrink basis-0">
                      <div className="self-stretch h-4 text-sm leading-none">
                        {row.person.name}
                      </div>
                      <div className="self-stretch h-4 text-xs leading-none tracking-tight underline">
                        {row.person.email}
                      </div>
                    </div>
                  )}

                  {column.id === "position" && (
                    <div className="h-5 text-sm leading-tight grow shrink basis-0">
                      {row.position}
                    </div>
                  )}

                  {column.id === "location" && (
                    <div className="h-5 text-sm leading-tight grow shrink basis-0">
                      {row.location}
                    </div>
                  )}

                  {column.id === "status" && Chip && (
                    <Chip
                      variant={row.status.type}
                      label={row.status.label}
                      className={chipClass}
                      icon={getChipIcon(row.status.type)}
                      variantClassNames={{
                        info: chipInfoClass,
                        warning: chipWarningClass,
                        danger: chipDangerClass,
                        success: chipSuccessClass,
                      }}
                    />
                  )}
                </TableDataCell>
              </TableRow>
            );
          })}
        </div>
      ))}
    </div>
  );
};
