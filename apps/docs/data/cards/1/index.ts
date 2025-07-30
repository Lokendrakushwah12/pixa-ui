export const codeData = `import { motion, AnimatePresence, MotionConfig } from "motion/react";";
import StackCard from "./StackCard";

const collection: Collection = {
  id: 1,
  title: "Nature Collection",
  images: [
    "https://images.unsplash.com/photo-1675897974745-1e78e8690755",
    "https://images.unsplash.com/photo-1486718448742-163732cd1544",
    "https://images.unsplash.com/photo-1600669091588-8aaac09509ba",
    "https://images.unsplash.com/photo-1583100913639-b8a172d90b77",
    "https://images.unsplash.com/photo-1583100913828-aeff24cc04ae",
    "https://images.unsplash.com/photo-1583100913639-f3b195f86da2",
  ],
};

function App() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  return (
    <>
       <StackItem
          key={collection.id}
          images={collection.images}
          title={collection.title}
          index={0}
          isExpanded={expandedIndex === 0}
          onClick={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
        />
    </>
  );
}

export default App;`;

export const installationData = `npm i framer-motion`;

export const data = [
  {
    name: "images",
    nameDetails: "Array of image URLs displayed in the stack",
    type: "string[]",
    typeDetails: "An array containing URLs of images to be displayed",
    default: "[]",
  },
  {
    name: "title",
    nameDetails: "Title of the StackCard component",
    type: "string",
    typeDetails: "A string representing the title displayed on the card",
    default: `""`,
  },
  {
    name: "index",
    nameDetails: "Index of the card in the stack",
    type: "number",
    typeDetails: "A number representing the position of the card in the stack",
    default: "0",
  },
  {
    name: "isExpanded",
    nameDetails: "Controls the expanded or collapsed state of the card",
    type: "boolean",
    typeDetails: "A boolean value determining if the card is expanded",
    default: "false",
  },
  {
    name: "onClick",
    nameDetails: "Function to handle click events",
    type: "function",
    typeDetails: "A function triggered when the card is clicked",
    default: "() => {}",
  },
];
