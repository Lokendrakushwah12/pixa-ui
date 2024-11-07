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

export const data = [
  {
    name: "title",
    nameDetails: "Text to display on the button",
    type: "string",
    typeDetails: "The text content for the button",
    default: `""`,
  },
  {
    name: "icon",
    nameDetails: "Displays an icon beside the button title when true",
    type: "boolean",
    typeDetails: "Set to true to show an icon",
    default: "true",
  },
  {
    name: "loading",
    nameDetails: "Shows a loading spinner on the button when true",
    type: "boolean",
    typeDetails: "Set to true to indicate a loading state",
    default: "false",
  },
  {
    name: "borderRadius",
    nameDetails: "Defines the border radius of the button",
    type: "string",
    typeDetails: "Any valid CSS value for border-radius",
    default: `"8px"`,
  },
  {
    name: "variant",
    nameDetails: "Sets the button's style variant",
    type: `"default" | "primary" | "secondary" | "destructive"`,
    typeDetails: "Button style options",
    default: `"default"`,
  },
  {
    name: "className",
    nameDetails: "Adds additional CSS classes to the button for styling",
    type: "string",
    typeDetails: "CSS class names for custom styling",
    default: `""`,
  },
  {
    name: "style",
    nameDetails: "Inline styles for custom button styling",
    type: "CSSProperties",
    typeDetails: "An object containing CSS properties",
    default: "undefined",
  },
];
