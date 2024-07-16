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
        leadEmail: {
          to: string;
          cc: string;
        };
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