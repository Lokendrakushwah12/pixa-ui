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

export const data = [
  {
    name: "title",
    nameDetails: "Text to display on the button",
    type: "string",
    typeDetails: "The text content for the button",
    default: `""`,
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
    default: `"#212121"`,
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
