export interface CardDataType {
  title: string;
  href: string;
  component?: React.ReactNode;
  download?: React.ReactNode;
}

export const tabs = [
  "Buttons",
  "Cards",
  "Tabs",
  "Dialogs",
  "Extra",
] as const;
export type TabType = (typeof tabs)[number];
