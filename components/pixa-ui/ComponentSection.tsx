import React from "react";

interface ComponentSectionProps {
  children: React.ReactNode;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ children }) => {
  return (
    <div className="mb-12 flex w-full flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2 xs:grid-cols-2 xs:px-3 md:grid-cols-4 md:gap-4">
        {children}
      </div>
    </div>
  );
};

export default ComponentSection;
