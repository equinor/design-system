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
import { Typography } from "./Typography";

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
          } inline-flex flex-col items-start justify-start shrink basis-0`}
        >
          <TableHeader
            data-color-appearance={column.active ? "accent" : undefined}
            className={`${thClass} ${column.active ? activeThClass : ""}`}
          >
            {column.id === "checkbox" ? (
              <CheckmarkUnselected className={checkmarkClass} />
            ) : (
              <Typography
                as="span"
                size="sm"
                baselineAligned={false}
                weight="semibold"
              >
                {column.label}
              </Typography>
            )}
          </TableHeader>

          {/* Render table data for each row */}
          {tableData.map((row) => {
            return (
              <TableRow
                key={`row-${row.id}`}
                className={`${row.active ? trActiveClass : ""}`}
              >
                <TableDataCell className={tdClass}>
                  {column.id === "checkbox" &&
                    (row.selected ? (
                      <CheckmarkSelected className={checkmarkClass} />
                    ) : (
                      <CheckmarkUnselected className={checkmarkClass} />
                    ))}

                  {column.id === "id" && (
                    <Typography as="span" size="sm" baselineAligned={false}>
                      {row.id}
                    </Typography>
                  )}

                  {column.id === "person" && (
                    <span className="inline-flex flex-col items-start justify-center gap-0.5">
                      <Typography as="span" size="sm" baselineAligned={false}>
                        {row.person.name}
                      </Typography>
                      <Typography
                        as="span"
                        size="xs"
                        baselineAligned={false}
                        className="underline"
                      >
                        {row.person.email}
                      </Typography>
                    </span>
                  )}

                  {column.id === "position" && (
                    <Typography as="span" size="sm" baselineAligned={false}>
                      {row.position}
                    </Typography>
                  )}

                  {column.id === "location" && (
                    <Typography as="span" size="sm" baselineAligned={false}>
                      {row.location}
                    </Typography>
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
