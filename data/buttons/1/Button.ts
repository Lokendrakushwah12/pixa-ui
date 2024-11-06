export const codeData = `import { ButtonV1 } from ./button-v1";
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

export const installationData = `npm i lucide-react`;

export const data = [
  {
    name: "title",
    nameDetails: "Text to display on the button",
    type: "string",
    typeDetails: "The text content for the button",
    default: `"ButtonV1"`,
  },
  {
    name: "svgColor",
    nameDetails: "Color of the SVG icon",
    type: "string",
    typeDetails: "Any valid CSS color value",
    default: `"#212121"`,
  },
  {
    name: "icon",
    nameDetails: "Icon to display inside the button",
    type: "ReactNode",
    typeDetails: "A React element representing an icon",
    default: "undefined",
  },
  {
    name: "className",
    nameDetails: "Additional classes for styling",
    type: "string",
    typeDetails: "CSS class names for custom styling",
    default: `""`,
  },
  {
    name: "style",
    nameDetails: "Inline styles for custom styling",
    type: "React.CSSProperties",
    typeDetails: "An object with inline styles",
    default: "undefined",
  },
];
