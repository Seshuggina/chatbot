export type ReactFlowNode = {
  id: string;
  type: string;
  data: {
    text: string;
    options?: {
      displayText: string;
      subOptions: {
        title: string;
        subTitle: string;
        value: string;
        leadEmailTo:string;
        leadEmailCc:string;
      }[];
    };
  };
};

export type ReactFlowEdge = {
  source: string;
  target: string;
};

export type ReactFlowData = {
  nodes: any[];
  edges: ReactFlowEdge[];
};

// Options
export interface SubOption {
  id:string;
  title: string;
  subTitle: string;
  value: string;
  category: string;
  leadEmailTo: string;
  leadEmailCc: string;
  isCollapsed?: boolean;
}

export interface Option {
  displayText: string;
  propertyName: string;
  message: string;
  fallback: string;
  subOptions: SubOption[];
}
// End of Options