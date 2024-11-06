export const codeData = `import { ButtonV3 } from "@pixaui/button-v3";

function App() {
  return (
    <ButtonV3
      title="ButtonV3"
      borderRadius="12px"
      color="#763afe"
      padding="12px"
    />
  );
}

export default App;`;

export const installationData = `npm i @pixaui/button-v3`;

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
    default: `"ButtonV3"`,
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
    default: `"#763afe"`,
    description: "Main color of the button, including hover effect",
  },
  {
    prop: "padding",
    type: "string",
    default: `"8px"`,
    description: "Padding inside the button",
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
