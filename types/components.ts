export interface Component {
  id: string;
  name: string;
  description: string;
  component?: React.ElementType;
  code?: string; // Optional code snippet for the component
  props?: ComponentProp[]; // Optional props for the component
  dependencies?: string[]; // Optional dependencies required for the component
  examples?: example[]; // Optional example usage of the component
  previewImage?: string; // Optional preview for grid view
}

export interface example {
  name: string;
  code: string;
  description: string;
}

export interface ComponentCategory {
  id: string;
  name: string;
  description: string;
  components: Component[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description?: string;
}