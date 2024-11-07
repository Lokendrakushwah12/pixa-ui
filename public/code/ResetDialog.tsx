import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function ResetDialog({
  isOpen,
  onClose,
  onReset,
}: ResetDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute("data-scroll-locked", "true");
    } else {
      document.body.removeAttribute("data-scroll-locked");
    }

    return () => {
      document.body.removeAttribute("data-scroll-locked");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="dialog-holder"
          className="absolute z-[50] flex h-full w-full cursor-default items-center justify-center md:w-fit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            id="dialog-backdrop"
            className="fixed inset-0 bg-black bg-opacity-75"
            aria-hidden="true"
            onClick={onClose}
          ></div>

          <motion.dialog
            id="dialog-wipe-confirm"
            open
            className="w-[340px] rounded-2xl border-2 border-[#212121] p-3 shadow-lg dark:bg-[#121212]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="flex flex-col">
              <div className="popup-header flex flex-col items-center space-x-2">
                <div className="popup-icon text-[#ed2236]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tabler-icon tabler-icon-alert-triangle"
                  >
                    <path d="M12 9v4"></path>
                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"></path>
                    <path d="M12 16h.01"></path>
                  </svg>
                </div>
                <h2 className="popup-title text-lg" tabIndex={-1}>
                  Reset all data?
                </h2>
                <div
                  className="body-text mt-1 cursor-text text-center text-neutral-500"
                  tabIndex={-1}
                >
                  Are you sure you want to reset all data? This action is
                  immediate and irreversible.
                </div>
              </div>
              <div className="popup-buttons mt-6 flex justify-center gap-2">
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-neutral-800 px-4 py-2 transition-all hover:bg-neutral-700/60"
                >
                  Cancel
                </button>
                <button
                  onClick={onReset}
                  className="w-full rounded-xl bg-[#ed2236] px-4 py-2 text-white transition-all hover:bg-[#d61c2e]"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
