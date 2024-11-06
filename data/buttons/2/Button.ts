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
    default: `"ButtonV2"`,
    description: "Text to display on the button",
  },
  {
    prop: "bgColor",
    type: "string",
    default: `"bg-[#f0900f]"`,
    description: "Background color for the animated hover effect",
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
