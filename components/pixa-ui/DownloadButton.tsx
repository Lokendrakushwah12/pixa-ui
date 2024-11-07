"use client";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

const DownloadButton = () => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [buttonCode, setButtonCode] = useState("");

  useEffect(() => {
    const fetchButtonCode = async () => {
      try {
        const response = await fetch("./app/buttons/1/Button.tsx");
        const text = await response.text();
        setButtonCode(text);
      } catch (error) {
        console.error("Failed to fetch button.tsx content", error);
      }
    };
    fetchButtonCode();
  }, []);

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(buttonCode);
  };

  return (
    <div>
      <button
        className="rounded-sm p-[3px] transition-all hover:bg-[#ffffff1d]"
        onClick={onCopy}
      >
        {isCopied ? (
          <CheckIcon size={14} className="text-[#b0b0b0]" />
        ) : (
          <CopyIcon size={14} className="text-[#b0b0b0]" />
        )}
        <span className="sr-only">Copy code</span>
      </button>
    </div>
  );
};

export default DownloadButton;
