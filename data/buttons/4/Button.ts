export const codeData = `import { ButtonV4 } from "@pixaui/button-v4";

function App() {
  return (
    <ButtonV4
      title="ButtonV4"
      borderRadius="12px"
      color="#d306a4"
      className="border-[#313131] bg-[#d9d2d9] hover:bg-[#d306a4]"
    />
  );
}

export default App;`;

export const installationData = `npm i @pixaui/button-v4`;

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
    prop: "borderRadius",
    type: "string",
    default: `"8px"`,
    description: "Border radius for button's rounded corners",
  },
  {
    prop: "color",
    type: "string",
    default: `"#212121"`,
    description: "Main color of the button, including hover effect",
  },
  {
    prop: "className",
    type: "string",
    default: `""`,
    description: "Additional classes for styling the button container",
  },
  {
    prop: "style",
    type: "CSSProperties",
    default: "undefined",
    description: "Inline styles for custom styling",
  },
];
