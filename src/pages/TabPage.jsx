import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import Drawer from "../Components/Buttons/Drawer";
import Airplane from "../assets/icons/Airplane";
import TabV1 from "../Components/Tabs/TabV1";
import HomeIcon from "../assets/icons/home"; // Example import
import AddIcon from "../assets/icons/add-square"; // Example import
import CoffeeIcon from "../assets/icons/coffee"; // Example import
import GhostIcon from "../assets/icons/ghost"; // Example import
import PremiumIcon from "../assets/icons/crown"; // Example import
import TabV2 from "../Components/Tabs/TabV2";

const customStyle = {
  ...nightOwl,
  backgroundColor: "transparent",
  padding: "0.5rem",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "1.5",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
};

const tabs = [
  { name: "Home", icon: HomeIcon },
  { name: "Add", icon: AddIcon },
  { name: "Coffee", icon: CoffeeIcon },
  { name: "Ghost", icon: GhostIcon },
  { name: "Premium", icon: PremiumIcon },
];
const tabs2 = [
  { name: "Work" },
  { name: "Upload" },
  { name: "Coffee" },
  { name: "Premium" },
];
const TabPage = () => {
  const [buttonData, setButtonData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [copied, setCopied] = useState({
    installation: false,
    snippet: false,
    extraData: false,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); //drawer state

  const handleCopyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied({ ...copied, [type]: true });
        setTimeout(() => {
          setCopied({ ...copied, [type]: false });
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const renderCopyIcon = (isCopied) =>
    isCopied ? (
      <svg
        className="cursor-pointer rounded-full p-1 transition-all"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="#b0b0b0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-[#ffffff1d]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 8.25V18C20 21 18.21 22 16 22H8C5.79 22 4 21 4 18V8.25C4 5 5.79 4.25 8 4.25C8 4.87 8.24997 5.43 8.65997 5.84C9.06997 6.25 9.63 6.5 10.25 6.5H13.75C14.99 6.5 16 5.49 16 4.25C18.21 4.25 20 5 20 8.25Z"
          stroke="#b0b0b0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 4.25C16 5.49 14.99 6.5 13.75 6.5H10.25C9.63 6.5 9.06997 6.25 8.65997 5.84C8.24997 5.43 8 4.87 8 4.25C8 3.01 9.01 2 10.25 2H13.75C14.37 2 14.93 2.25 15.34 2.66C15.75 3.07 16 3.63 16 4.25Z"
          stroke="#b0b0b0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 13H12"
          stroke="#b0b0b0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 17H16"
          stroke="#b0b0b0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  const toggleDrawer = (data) => {
    //toggle drawer function
    setIsDrawerOpen(!isDrawerOpen);
    setSelectedData(data);
  };

  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const res = await fetch("./Data/tabData.json");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setButtonData(data);
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchButtonData();
  }, []);

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="flex h-full w-full flex-col gap-4 pt-8 md:flex-row">
          <div className="flex w-full flex-col items-start justify-start gap-4 md:w-1/2">
            {/* Install */}
            <div className="relative flex w-full flex-col items-start justify-center gap-1">
              <h1 className="text-xl font-bold text-gray-900">
                Install the package
              </h1>
              <div className="flex w-full select-text items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-[#0f1012] pr-2 text-sm text-gray-900 selection:bg-white/10">
                <SyntaxHighlighter
                  className="bg-black"
                  language="bash"
                  style={customStyle}
                >
                  {selectedData.installationCmd}
                </SyntaxHighlighter>
                <div
                  onClick={() =>
                    handleCopyToClipboard(
                      selectedData.installationCmd,
                      "installation",
                    )
                  }
                >
                  {renderCopyIcon(copied.installation)}
                </div>
              </div>
            </div>
            {/* Usage 1 */}
            <div className="relative flex w-full flex-col items-start justify-center gap-1">
              <h1 className="text-xl font-bold text-gray-900">Usage</h1>
              <div
                onClick={() =>
                  handleCopyToClipboard(selectedData.snippetData, "snippet")
                }
                className="absolute right-2 top-10 z-50"
              >
                {renderCopyIcon(copied.snippet)}
              </div>
              <div className="hide-scrollbar relative flex w-full select-text items-center justify-between overflow-x-auto rounded-lg border border-gray-200 bg-[#0f1012] text-sm text-gray-900 transition-all selection:bg-white/10">
                <SyntaxHighlighter language="jsx" style={customStyle}>
                  {selectedData.snippetData}
                </SyntaxHighlighter>
              </div>
              {/* Airplane */}
              {selectedData.componentName === "TabV1" && (
                <div className="relative flex w-full flex-col items-start justify-center gap-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    Custom icon Component should look like this
                  </h1>
                  <div className="flex w-full select-text items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-[#0f1012] pr-2 text-sm text-gray-900 selection:bg-white/10">
                    <SyntaxHighlighter
                      className="bg-black"
                      language="bash"
                      style={customStyle}
                    >
                      {selectedData.extraData}
                    </SyntaxHighlighter>
                    <div
                      onClick={() =>
                        handleCopyToClipboard(
                          selectedData.extraData,
                          "extraData",
                        )
                      }
                      className="absolute right-2 top-10 z-50"
                    >
                      {renderCopyIcon(copied.extraData)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-4 md:w-1/2 md:flex-row">
            {/* Preview */}
            <div className="flex h-full w-full flex-col items-start justify-center gap-1 px-4 md:px-0">
              <h1 className="text-xl font-bold text-gray-900">Preview</h1>
              <div className="flex h-full w-full flex-col items-center justify-start gap-2 overflow-y-scroll rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-900">
                {/* Tab V1 */}
                {selectedData.componentName === "TabV1" && (
                  <>
                    <TabV1 tabs={tabs} />
                  </>
                )}
                {/* Tab V2 */}
                {selectedData.componentName === "TabV2" && (
                  <div className="flex flex-col items-center justify-center gap-8">
                    <TabV2 tabs={tabs} />
                    <TabV2
                      tabs={tabs2}
                      textColor="text-[#f0f0f0]"
                      hoverTextColor="hover:text-[#fff]"
                      tabHoverColor="bg-[#313131]"
                      tabBorderRadius="rounded-full"
                      className="rounded-full border border-[#414141] bg-[#121212] p-1 text-[#ffffff]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <div className="responsiveSection grid">
        {/* <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w[1440px]"> */}
        {buttonData.map((data, index) => (
          <div
            key={index}
            onClick={() => toggleDrawer(data)}
            className={`flex h-[225px] w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition-all hover:bg-[#fbfbfb] md:h-[300px] md:w-[400px]`}
          >
            {data.componentName === "TabV1" && (
              <div>
                <TabV1
                  tabs={tabs}
                  className="pointer-events-none rounded-2xl border bg-white p-4 shadow-sm"
                />
              </div>
            )}
            {data.componentName === "TabV2" && (
              <div>
                <TabV2
                  tabs={tabs.slice(0, 3)}
                  className="pointer-events-none rounded-2xl border bg-white p-4 shadow-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TabPage;
