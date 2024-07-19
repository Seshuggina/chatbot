type ReactFlowNode = {
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
        catrgory:string;
        leadEmailTo:String;
        leadEmailCc:String;
      }[];
    };
  };
};

type ReactFlowEdge = {
  source: string;
  target: string;
};

type ReactFlowData = {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
};

type FlowEntry = {
  flowId: string;
  nextFlowId: string | null;
  type: string;
  content: string[];
  children: any[];
  _id: {
    $oid: string;
  };
};

type ChatbotFlow = {
  _id: {
    $oid: string;
  };
  organizationId: {
    $oid: string;
  };
  botId: {
    $oid: string;
  };
  mode: any[];
  createdAt: {
    $date: string;
  };
  version: number;
  startFlowId: string;
  flows: FlowEntry[];
  __v: number;
  deployedAt: {
    $date: string;
  };
  modifiedAt: {
    $date: string;
  };
};

function generateObjectId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateChatbotFlow(reactflowData: ReactFlowData): ChatbotFlow {
  const { nodes, edges } = reactflowData;

  const flows: FlowEntry[] = [];
  const flowMap = new Map<string, FlowEntry>();

  // Create flow entries from nodes
  nodes.forEach((node) => {
    const flowId = node.id;
    const flowEntry: FlowEntry = {
      flowId,
      nextFlowId: null,
      type: node.type,
      content: [],
      children: [],
      _id: {
        $oid: generateObjectId(),
      },
    };

    // Set content based on node type
    if (node.type === "start") {
      flowEntry.content.push(node.data.text);
    } else if (node.type === "message") {
      flowEntry.content.push(node.data.text);
    } else if (node.type === "options" && node.data.options) {
      flowEntry.content.push(node.data.options.displayText);
      node.data.options.subOptions.forEach((option) => {
        flowEntry.children.push({
          title: option.title,
          subTitle: option.subTitle,
          value: option.value,
          leadEmailCc: option.leadEmailTo,
          leadEmailTo: option.leadEmailCc,
          id: option.title.replace(/\s+/g, "").toLowerCase(),
          nextFlowId: null, // Will be set later
        });
      });
    }

    flows.push(flowEntry);
    flowMap.set(flowId, flowEntry);
  });

  // Set nextFlowId based on edges
  edges.forEach((edge) => {
    const sourceFlow = flowMap.get(edge.source);
    const targetFlow = flowMap.get(edge.target);

    if (sourceFlow && targetFlow) {
      sourceFlow.nextFlowId = targetFlow.flowId;
    }
  });

  return {
    _id: {
      $oid: generateObjectId(),
    },
    organizationId: {
      $oid: generateObjectId(),
    },
    botId: {
      $oid: generateObjectId(),
    },
    mode: [],
    createdAt: {
      $date: new Date().toISOString(),
    },
    version: 3,
    startFlowId: nodes.find((node) => node.type === "start")!.id,
    flows,
    __v: 0,
    deployedAt: {
      $date: new Date().toISOString(),
    },
    modifiedAt: {
      $date: new Date().toISOString(),
    },
  };
}
