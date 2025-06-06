import ButtonAi from "@/components/pixa-ui/button-ai";
import ButtonSlideLeft from "@/components/pixa-ui/button-slide-left";
import ButtonSlideRight from "@/components/pixa-ui/button-slide-right";
import ButtonSlideUp from "@/components/pixa-ui/button-slide-up";
import ButtonUnflatten from "@/components/pixa-ui/button-unflatten";
import { ComponentCategory, ComponentProp } from "@/types/components";

// Component code strings - you'll need to add the actual code for each component
const buttonAiCode = `"use client";
import { useState } from "react";

interface ButtonAiProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "processing";
}

export const ButtonAi = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = "default" 
}: ButtonAiProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = () => {
    if (disabled || isProcessing) return;
    setIsProcessing(true);
    onClick?.();
    // Reset processing state after animation
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      <span className={isProcessing ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};`;

const buttonSlideLeftCode = `"use client";

interface ButtonSlideLeftProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonSlideLeft = ({ 
  children, 
  onClick, 
  disabled = false 
}: ButtonSlideLeftProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative overflow-hidden px-6 py-3 bg-gray-900 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
    </button>
  );
};`;

const buttonSlideRightCode = `"use client";

interface ButtonSlideRightProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonSlideRight = ({ 
  children, 
  onClick, 
  disabled = false 
}: ButtonSlideRightProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative overflow-hidden px-6 py-3 bg-gray-900 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
    </button>
  );
};`;

const buttonSlideUpCode = `"use client";

interface ButtonSlideUpProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonSlideUp = ({ 
  children, 
  onClick, 
  disabled = false 
}: ButtonSlideUpProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative overflow-hidden px-6 py-3 bg-gray-900 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-green-500 to-blue-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </button>
  );
};`;

const buttonUnflattenCode = `"use client";
import { useState } from "react";

interface ButtonUnflattenProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonUnflatten = ({ 
  children, 
  onClick, 
  disabled = false 
}: ButtonUnflattenProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={\`relative px-6 py-3 bg-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-600 disabled:opacity-50 \${
        isPressed 
          ? 'shadow-none translate-y-1' 
          : 'shadow-lg hover:shadow-xl'
      }\`}
      style={{
        boxShadow: isPressed 
          ? 'none' 
          : '0 4px 0 #3b82f6, 0 8px 16px rgba(59, 130, 246, 0.3)'
      }}
    >
      {children}
    </button>
  );
};`;

// Props definitions
const buttonAiProps: ComponentProp[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The content to display inside the button",
  },
  {
    name: "onClick",
    type: "() => void",
    required: false,
    description: "Function to call when the button is clicked",
  },
  {
    name: "disabled",
    type: "boolean",
    required: false,
    default: "false",
    description: "Whether the button is disabled",
  },
  {
    name: "variant",
    type: '"default" | "processing"',
    required: false,
    default: '"default"',
    description: "The visual variant of the button",
  },
];

const buttonSlideProps: ComponentProp[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The content to display inside the button",
  },
  {
    name: "onClick",
    type: "() => void",
    required: false,
    description: "Function to call when the button is clicked",
  },
  {
    name: "disabled",
    type: "boolean",
    required: false,
    default: "false",
    description: "Whether the button is disabled",
  },
];

const buttonUnflattenProps: ComponentProp[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The content to display inside the button",
  },
  {
    name: "onClick",
    type: "() => void",
    required: false,
    description: "Function to call when the button is clicked",
  },
  {
    name: "disabled",
    type: "boolean",
    required: false,
    default: "false",
    description: "Whether the button is disabled",
  },
];

export const componentCategories: ComponentCategory[] = [
  {
    id: "buttons",
    name: "Buttons",
    description:
      "Collection of unique button designs with different styles and animations",
    components: [
      {
        id: "button-ai",
        name: "AI Button",
        description:
          "Interactive button with AI-driven animations and loading states",
        component: ButtonAi,
        code: buttonAiCode,
        props: buttonAiProps,
        dependencies: [],
        examples: [
          {
            name: "Basic Usage",
            code: `<ButtonAi onClick={() => console.log('Processing...')}>
  Generate AI Content
</ButtonAi>`,
            description: "Basic AI button with click handler",
          },
          {
            name: "Disabled State",
            code: `<ButtonAi disabled>
  Processing...
</ButtonAi>`,
            description: "Disabled AI button",
          },
        ],
      },
      {
        id: "button-slide-left",
        name: "Slide Left Button",
        description:
          "Button with smooth left sliding background animation on hover",
        component: ButtonSlideLeft,
        code: buttonSlideLeftCode,
        props: buttonSlideProps,
        dependencies: [],
        examples: [
          {
            name: "Basic Usage",
            code: `<ButtonSlideLeft onClick={() => alert('Clicked!')}>
  Slide Left
</ButtonSlideLeft>`,
            description: "Basic slide left button",
          },
        ],
      },
      {
        id: "button-slide-right",
        name: "Slide Right Button",
        description:
          "Button with smooth right sliding background animation on hover",
        component: ButtonSlideRight,
        code: buttonSlideRightCode,
        props: buttonSlideProps,
        dependencies: [],
        examples: [
          {
            name: "Basic Usage",
            code: `<ButtonSlideRight onClick={() => alert('Clicked!')}>
  Slide Right
</ButtonSlideRight>`,
            description: "Basic slide right button",
          },
        ],
      },
      {
        id: "button-slide-up",
        name: "Slide Up Button",
        description:
          "Button with smooth upward sliding background animation on hover",
        component: ButtonSlideUp,
        code: buttonSlideUpCode,
        props: buttonSlideProps,
        dependencies: [],
        examples: [
          {
            name: "Basic Usage",
            code: `<ButtonSlideUp onClick={() => alert('Clicked!')}>
  Slide Up
</ButtonSlideUp>`,
            description: "Basic slide up button",
          },
        ],
      },
      {
        id: "button-unflatten",
        name: "Unflatten Button",
        description:
          "Material Design inspired button with 3D unflatten effect on press",
        component: ButtonUnflatten,
        code: buttonUnflattenCode,
        props: buttonUnflattenProps,
        dependencies: [],
        examples: [
          {
            name: "Basic Usage",
            code: `<ButtonUnflatten onClick={() => alert('Unflatten!')}>
  Press Me
</ButtonUnflatten>`,
            description: "Basic unflatten button with 3D effect",
          },
        ],
      },
    ],
  },
  {
    id: "cards",
    name: "Cards",
    description:
      "Diverse card components for different use cases and aesthetics",
    components: [
      {
        id: "floating-product",
        name: "Floating Product Card",
        description:
          "Product card with floating elements and micro-interactions",
        component: ButtonAi, // Placeholder - replace with actual card component
        code: `// TODO: Add actual card component code`,
        props: [],
        dependencies: [],
        examples: [],
      },
    ],
  },
  {
    id: "dialogs",
    name: "Dialogs",
    description: "Modal dialogs with different styles and animations",
    components: [
      {
        id: "modern-alert",
        name: "Modern Alert Dialog",
        description:
          "Sleek alert dialog with modern design and smooth animations",
        component: ButtonSlideLeft, // Placeholder - replace with actual dialog component
        code: `// TODO: Add actual dialog component code`,
        props: [],
        dependencies: [],
        examples: [],
      },
    ],
  },
];

// Helper functions
export const getCategoryById = (id: string) =>
  componentCategories.find((cat) => cat.id === id);

export const getComponentById = (categoryId: string, componentId: string) => {
  const category = getCategoryById(categoryId);
  return category?.components.find((comp) => comp.id === componentId);
};

export const getAllCategories = () => componentCategories;
