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

export const data = [
  {
    name: "title",
    nameDetails: "Text to display on the button",
    type: "string",
    typeDetails: "The text content for the button",
    default: `"ButtonV3"`,
  },
  {
    name: "borderRadius",
    nameDetails: "Border radius for button's rounded corners",
    type: "string",
    typeDetails: "Any valid CSS value for border-radius",
    default: `"8px"`,
  },
  {
    name: "color",
    nameDetails: "Main color of the button, including hover effect",
    type: "string",
    typeDetails: "Any valid CSS color value",
    default: `"#763afe"`,
  },
  {
    name: "padding",
    nameDetails: "Padding inside the button",
    type: "string",
    typeDetails: "Any valid CSS value for padding",
    default: `"8px"`,
  },
  {
    name: "className",
    nameDetails: "Additional classes for styling the button container",
    type: "string",
    typeDetails: "CSS class names for custom styling",
    default: `""`,
  },
  {
    name: "style",
    nameDetails: "Inline styles for custom styling",
    type: "CSSProperties",
    typeDetails: "An object containing CSS properties",
    default: "undefined",
  },
];