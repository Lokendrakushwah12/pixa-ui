import React from "react";

interface TableProps {
  columns: { header: string; key: string }[];
  data: { [key: string]: string }[];
}

const TableComponent: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className="scroll-min w-full overflow-auto rounded-lg border border-[#d9d9d9] dark:border-[#212121]">
      <table className="overflow-auto min-w-full">
        <thead className="w-full bg-[#f2f2f2] text-[#212121] dark:bg-[#0f0f0f] dark:text-[#e2e2e2]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="overflow-hidden rounded-tl-lg border border-[#d9d9d9] px-4 py-2 dark:border-[#212121]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#414141] dark:text-[#aaa]">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border border-[#d9d9d9] px-4 py-2 dark:border-[#212121]"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
