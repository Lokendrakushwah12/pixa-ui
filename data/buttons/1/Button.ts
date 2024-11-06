export const codeData = `import { ButtonV1 } from "@pixaui/button-v1";
import { Plane } from "lucide-react";

function App() {
  return (
    <>
      <ButtonV1
        title="ButtonV1"
        svgColor="#212121"
        icon={
          <Plane
            size={18}
            strokeWidth={1.5}
            className="text-[#212121] dark:text-[#e2e2e2]"
          />
        }
        className="rounded-xl border-[#d9d9d9] py-4 text-[#212121] backdrop-blur-sm dark:border-[#212121] dark:text-[#e2e2e2]"
      />
    </>
  );
}

export default App;`;

export const installationData = `npm i @pixaui/button-v1 lucide-react`;

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
    default: `"ButtonV1"`,
    description: "Text to display on the button",
  },
  {
    prop: "svgColor",
    type: "string",
    default: `"#212121"`,
    description: "Color of the SVG icon",
  },
  {
    prop: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Icon to display inside the button",
  },
  {
    prop: "className",
    type: "string",
    default: `""`,
    description: "Additional classes for styling",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    default: "undefined",
    description: "Inline styles for custom styling",
  },
];
