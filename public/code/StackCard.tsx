import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface StackCardProps {
  images: string[];
  title: string;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

const calculateGridPosition = (
  index: number,
  total: number,
): { x: number; y: number } => {
  const columns = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / columns);
  const col = index % columns;
  return {
    x: col * 260 - ((columns - 1) * 260) / 2,
    y: row * 280 - (Math.floor((total - 1) / columns) * 280) / 2,
  };
};

const StackCard: React.FC<StackCardProps> = ({
  images,
  title,
  index,
  isExpanded,
  onClick,
}) => {
  const stackVariants = {
    collapsed: (i: number) => ({
      rotate: i * 4,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.6,
      },
    }),
    expanded: (i: number) => {
      const position = calculateGridPosition(i, images.length);
      return {
        rotate: 0,
        scale: 0.8,
        x: position.x+150,
        y: position.y+50,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 0.6,
          delay: i * 0.05,
        },
      };
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex size-full items-center justify-center overflow-visible ${
        isExpanded ? "z-[60]" : ""
      }`}
      transition={{ type: "spring", bounce: 0.3 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={`fixed inset-0 z-50 h-screen w-screen bg-background transition-all ${isExpanded ? "z-[-10]" : ""} `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className={`relative flex h-full w-full items-center justify-center`}
        animate={{ height: isExpanded ? "400px" : "300px" }}
      >
        <AnimatePresence>
          {images.map((image, imgIndex) => (
            <motion.div
              key={imgIndex}
              className="absolute inset-0 h-full w-full"
              custom={imgIndex}
              variants={stackVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              style={{
                zIndex: images.length - imgIndex,
                transformOrigin: "center center",
              }}
            >
              <div
                className={`flex size-full items-center justify-center p-2 transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100"
                    : imgIndex === 0
                      ? "opacity-100"
                      : "opacity-90"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  width={isExpanded ? 600 : 200}
                  height={isExpanded ? 400 : 200}
                  className={`rounded-lg object-cover shadow-lg transition-all duration-300 ${
                    isExpanded ? "h-[300px] w-[300px]" : "h-[200px] w-[200px]"
                  }`}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <motion.span
        className={`absolute w-full text-center text-foreground transition-all duration-300 ${
          isExpanded ? "hidden" : "bottom-0 text-base"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      >
        {title}
      </motion.span>
    </motion.button>
  );
};

export default StackCard;
