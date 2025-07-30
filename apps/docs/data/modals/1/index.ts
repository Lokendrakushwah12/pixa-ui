export const codeData = `import React, { useState } from "react";";
import ResetDialog from "./ResetDialog";

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReset = () => {
    console.log("Reset action confirmed");
    setDialogOpen(false);
  };
  
  return (
    <>
     <button
      onClick={() => setDialogOpen(true)}
    >
      Open Reset Dialog
    </button>
    <ResetDialog
      isOpen={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onReset={handleReset}
    />
    </>
  );
}

export default App;`;

export const installationData = `npm i framer-motion`;

export const data = [
  {
    name: "isOpen",
    nameDetails: "Controls the visibility of the dialog",
    type: "boolean",
    typeDetails:
      "A boolean value that determines if the dialog is visible or not",
    default: `false`,
  },
  {
    name: "onClose",
    nameDetails: "Function to handle closing the dialog",
    type: "function",
    typeDetails: "A function that is triggered when the dialog is closed",
    default: "undefined",
  },
  {
    name: "onReset",
    nameDetails: "Function to handle the reset action",
    type: "function",
    typeDetails: "A function that is triggered when the user clicks on 'Reset'",
    default: "undefined",
  },
];
