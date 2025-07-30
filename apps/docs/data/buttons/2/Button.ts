export const codeData = `import { ButtonV2 } from "@pixaui/button-v2";

function App() {
  return (
    <ButtonV2
      title="ButtonV2"
      bgColor="#00fff04c"
      className="rounded-xl border border-[#d9d9d9] py-4 text-[#212121] backdrop-blur-sm"
    />
  );
}

export default App;`;

export const installationData = `npm i @pixaui/button-v2`;

export const data = [
  {
    name: "title",
    nameDetails: "Text to display on the button",
    type: "string",
    typeDetails: "The text content for the button",
    default: `"ButtonV2"`,
  },
  {
    name: "bgColor",
    nameDetails: "Background color for the animated hover effect",
    type: "string",
    typeDetails: "Any valid CSS color value",
    default: `"bg-[#f0900f]"`,
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
