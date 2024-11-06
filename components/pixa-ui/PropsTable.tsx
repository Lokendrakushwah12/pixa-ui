import clsx from "clsx";
import type React from "react";
import { PropInformation } from "./prop-information";

interface PropsTableProps {
  data: {
    name: string;
    nameDetails?: React.ReactNode;
    type: string;
    typeDetails?: React.ReactNode;
    default?: string;
    defaultDetails?: React.ReactNode;
  }[];
}

export const PropsTable = ({ data }: PropsTableProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-2 mt-6 h-[42px] w-full overflow-hidden rounded-lg border border-[var(--border)]">
        <div className="font-default text-gray-11 py-3 text-center text-sm">
          No Additional Props
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 h-full w-full overflow-x-scroll rounded-lg border border-[var(--border)]">
      <table className="h-full w-full md:table-fixed">
        <thead className="font-default text-default border-b border-[var(--border)] bg-[var(--button-secondary)] text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-normal">Prop</th>
            <th className="px-4 py-3 text-sm font-normal">Type</th>
            <th className="px-4 py-3 text-sm font-normal">Default</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.name}
              className={clsx(
                "font-default text-default w-full text-left",
                item !== data[data.length - 1] &&
                  "border-b border-[var(--border)]",
              )}
            >
              <td className="px-4 py-3 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <div className="w-fit rounded-md bg-blue-500/40 px-1 font-mono text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    {item.name}
                  </div>
                  {item.nameDetails && (
                    <PropInformation content={item.nameDetails} />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-normal">
                {item.type ? (
                  <div className="flex w-fit items-center gap-1">
                    <div className="w-fit rounded-md bg-neutral-200 px-1 font-mono text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400">
                      {item.type}
                    </div>
                    {item.typeDetails && (
                      <PropInformation content={item.typeDetails} />
                    )}
                  </div>
                ) : (
                  <div>-</div>
                )}
              </td>
              <td className="px-4 py-3 text-sm font-normal">
                {item.default ? (
                  <div className="w-fit rounded-md bg-neutral-200 px-1 font-mono text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400">
                    {item.default}
                  </div>
                ) : (
                  <div>-</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
