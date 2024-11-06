export const installationData = `npm i @pixaui/button-v5`;

export const codeData = `import { ButtonV5 } from "@pixaui/button-v5";

function App() {
  return (
    <ButtonV5
      title="ButtonV5"
      icon={true}
      loading={false}
      borderRadius="12px"
      variant="default"
      className="border-[#631e53] bg-[#d306a4] text-[#fff]"
    />
  );
}

export default App;`;

export const columns = [
  { header: "Prop", key: "prop" },
  { header: "Type", key: "type" },
  { header: "Default", key: "default" },
  { header: "Description", key: "description" },
];

export const data = [
  {
    prop: "title",
    type: "string",
    default: `""`,
    description: "Text to display on the button",
  },
  {
    prop: "icon",
    type: "boolean",
    default: "true",
    description: "Displays an icon beside the button title when true",
  },
  {
    prop: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a loading spinner on the button when true",
  },
  {
    prop: "borderRadius",
    type: "string",
    default: `"8px"`,
    description: "Defines the border radius of the button",
  },
  {
    prop: "variant",
    type: `"default" | "primary" | "secondary" | "destructive"`,
    default: `"default"`,
    description: "Sets the button's style variant",
  },
  {
    prop: "className",
    type: "string",
    default: `""`,
    description: "Adds additional CSS classes to the button for styling",
  },
  {
    prop: "style",
    type: "CSSProperties",
    default: "undefined",
    description: "Inline styles for custom button styling",
  },
];
