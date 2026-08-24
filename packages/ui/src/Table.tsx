import React, { TableHTMLAttributes, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@trace/utils";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  removeWrapper?: boolean;
  "aria-label"?: string;
}

export const Table: React.FC<TableProps> = ({ className, removeWrapper, children, ...props }) => {
  return (
    <div className={cn("w-full overflow-x-auto", !removeWrapper && "border border-border rounded-3xl")}>
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead className={cn("border-b border-border bg-default/40", className)} {...props}>
    <tr>{children}</tr>
  </thead>
);

export interface TableColumnProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "start" | "center" | "end";
}

export const TableColumn: React.FC<TableColumnProps> = ({ className, align = "start", children, ...props }) => {
  const aligns = {
    start: "text-left",
    center: "text-center",
    end: "text-right"
  };
  return (
    <th className={cn("py-3.5 px-4 font-bold text-xs text-foreground/70", aligns[align], className)} {...props}>
      {children}
    </th>
  );
};

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  emptyContent?: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ className, emptyContent, children, ...props }) => {
  const count = React.Children.count(children);
  return (
    <tbody className={cn("divide-y divide-border/60", className)} {...props}>
      {count === 0 && emptyContent ? (
        <tr>
          <td colSpan={100} className="py-8 text-center text-xs text-foreground/50">
            {emptyContent}
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  );
};

export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => (
  <tr className={cn("transition-colors hover:bg-default/20", className)} {...props}>
    {children}
  </tr>
);

export const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <td className={cn("py-3.5 px-4 text-xs text-foreground", className)} {...props}>
    {children}
  </td>
);

