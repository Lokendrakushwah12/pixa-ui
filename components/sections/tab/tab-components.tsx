import TabButton from "./tab-button-content";
import TabCardContent from "./tab-card-content";
import TabDialogContent from "./tab-dialog-content";
import TabExtraContent from "./tab-extra-content";
import TabTabContent from "./tab-tab-content";

type TabType = "Buttons" | "Cards" | "Tabs" | "Dialogs" | "Extra";

export const tabComponents: Record<TabType, React.ReactNode> = {
  Buttons: <TabButton />,
  Cards: <TabCardContent />,
  Tabs: <TabTabContent />,
  Dialogs: <TabDialogContent />,
  Extra: <TabExtraContent />,
};