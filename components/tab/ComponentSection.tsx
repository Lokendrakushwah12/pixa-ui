import React from "react";

interface ComponentSectionProps {
  children: React.ReactNode;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ children }) => {
  return (
    <div className="mb-12 flex w-full flex-col items-center gap-4">
      <div className="container grid max-w-screen">
        {children}
      </div>
    </div>
  );
};

export default ComponentSection;
