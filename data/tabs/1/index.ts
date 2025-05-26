export const codeData = `import { AnimatedTabs } from "@/components/core/animated-tabs";

function App() {
  const borderRadius = 16;
  const Color = "#0dad8d";   

  return (
    <>
      <AnimatedTabs
        defaultValue="tab1"
        className="w-[300px] bg-muted-foreground/10 p-1"
        style={{
          borderRadius: \`\${borderRadius}px\`,
        }}
      >
        <AnimatedTabs.List
          className="w-full bg-black p-1 rounded-xl"
          style={{
            borderRadius: \`\${borderRadius - 4}px\`,
          }}
        >
          <AnimatedTabs.Trigger
            value="tab1"
            className="w-full text-center text-sm"
            style={{
              borderRadius: \`\${borderRadius - 8}px\`,
              backgroundColor: Color || "transparent",
            }}
          >
            Tab 1
          </AnimatedTabs.Trigger>
          <AnimatedTabs.Trigger
            value="tab2"
            className="w-full text-center text-sm"
            style={{
              borderRadius: \`\${borderRadius - 8}px\`,
              backgroundColor: Color || "transparent",
            }}
          >
            Tab 2
          </AnimatedTabs.Trigger>
        </AnimatedTabs.List>

        <AnimatedTabs.Content value="tab1">
          <p className="text-sm text-muted-foreground px-2">This is the content for Tab 1.</p>
        </AnimatedTabs.Content>
        <AnimatedTabs.Content value="tab2">
          <p className="text-sm text-muted-foreground px-2">This is the content for Tab 2.</p>
        </AnimatedTabs.Content>
      </AnimatedTabs>
    </>
  );
}

export default App;`;

export const installationData = `npx shadcn@latest add https://pixaui.com/components/core/animated-tabs`;

// AnimatedTabs
export const AnimatedTabsProps = [
  {
    name: "defaultValue",
    nameDetails: "The default active tab value",
    type: "string",
    typeDetails: "Sets the initial active tab",
    default: `"tab1"`,
  },
  {
    name: "onValueChange",
    nameDetails: "Callback when the active tab changes",
    type: "function",
    typeDetails: "Triggered with the new tab value as a string",
    default: "undefined",
  },
  {
    name: "children",
    nameDetails: "Nested tab components (List, Trigger, Content)",
    type: "ReactNode",
    typeDetails: "JSX elements rendered inside the tab group",
    default: "—",
  },
  {
    name: "className",
    nameDetails: "Additional CSS classes",
    type: "string",
    typeDetails: "Useful for customizing the wrapper styling",
    default: "undefined",
  },
  {
    name: "style",
    nameDetails: "Inline styles for the tab wrapper",
    type: "React.CSSProperties",
    typeDetails: "Useful for dynamic styles like borderRadius, etc.",
    default: "undefined",
  },
];

// AnimatedTabs.List
export const AnimatedListPropsdata = [
  {
    name: "children",
    nameDetails: "Tab triggers inside the list",
    type: "ReactNode",
    typeDetails: "Usually one or more `<AnimatedTabs.Trigger>`",
    default: "—",
  },
  {
    name: "className",
    nameDetails: "Additional classes for the tab list container",
    type: "string",
    typeDetails: "Used to style the tab list flex container",
    default: "undefined",
  },
  {
    name: "style",
    nameDetails: "Inline styles for the tab list container",
    type: "React.CSSProperties",
    typeDetails: "Custom styling like borderRadius or backgroundColor",
    default: "undefined",
  },
];

// AnimatedTabs.Trigger
export const AnimatedTabsTriggerProps = [
  {
    name: "value",
    nameDetails: "Value linked to this specific tab",
    type: "string",
    typeDetails: "Must match the value in `<AnimatedTabs.Content>`",
    default: "—",
  },
  {
    name: "children",
    nameDetails: "Tab label or icon",
    type: "ReactNode",
    typeDetails: "The content displayed in the tab trigger",
    default: "—",
  },
  {
    name: "className",
    nameDetails: "Classes for the trigger element",
    type: "string",
    typeDetails: "Styles the trigger wrapper",
    default: "undefined",
  },
  {
    name: "style",
    nameDetails: "Inline styles for the trigger and motion element",
    type: "React.CSSProperties",
    typeDetails: "Used for borderRadius, backgroundColor, etc.",
    default: "undefined",
  },
  {
    name: "transition",
    nameDetails: "Spring animation for the active underline",
    type: "Transition",
    typeDetails: "Framer Motion transition config",
    default: `{ type: 'spring', stiffness: 300, damping: 22 }`,
  },
];

// AnimatedTabs.Content
export const AnimatedTabsContentProps = [
  {
    name: "value",
    nameDetails: "Value that matches a trigger to render content",
    type: "string",
    typeDetails: "Displays content only if value matches active tab",
    default: "—",
  },
  {
    name: "children",
    nameDetails: "Tab content to show when this tab is active",
    type: "ReactNode",
    typeDetails: "Can include any JSX or components",
    default: "—",
  },
  {
    name: "className",
    nameDetails: "CSS classes for styling content wrapper",
    type: "string",
    typeDetails: "Used to control spacing and appearance",
    default: "undefined",
  },
];
