type ReactFlowNode = {
  id: string;
  type: string;
  data: {
    text: string;
    options?: {
      displayText: string;
      propertyName: string;
      message: string;
      fallback: string;
      subOptions: {
        title: string;
        subTitle: string;
        value: string;
        category: string;
        leadEmailTo: string;
        leadEmailCc: string;
        isCollapsed: boolean;
      }[];
    };
    filesData?: {
      message: string;
      fileType: string;
      url: string;
      files: object[];
    };
    mapData?: {
      message: string;
      url: string;
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
  property?: string; // Added optional property
  displayText?: string; // Added optional displayText
  fallback?: string; // Added optional fallback
  filesData?: {
    message: string;
    fileType: string;
    url: string;
    files: object[];
  }; // Added optional filesData
  mapData?: {
    message: string;
    url: string;
  }; // Added optional mapData
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

function transformNodeToFlow(node: ReactFlowNode): FlowEntry {
  const flowEntry: FlowEntry = {
    flowId: node.id,
    nextFlowId: null,
    type: node.type,
    content: [],
    children: [],
    _id: {
      $oid: generateObjectId(),
    },
  };

  switch (node.type) {
    case 'start':
    case 'message':
      flowEntry.content = [node.data.text];
      break;

    case 'options':
      const optionsData = node.data.options!;
      flowEntry.content = [optionsData.message];
      flowEntry.property = optionsData.propertyName;
      flowEntry.displayText = optionsData.displayText;
      flowEntry.fallback = optionsData.fallback;
      optionsData.subOptions.forEach(option => {
        flowEntry.children.push({
          title: option.title,
          subTitle: option.subTitle,
          value: option.value,
          leadEmailTo: option.leadEmailTo,
          leadEmailCc: option.leadEmailCc,
          id: `${node.id}_${option.title.replace(/\s+/g, '_')}`,
          nextFlowId: null,
          category: option.category,
        });
      });
      break;

    case 'leadForm':
      flowEntry.content = ['Please fill out the form.'];
      break;

    case 'leadFlow':
      flowEntry.content = ['Lead flow initiated.'];
      break;

    case 'gptHandler':
      flowEntry.content = ['GPT handler is activated.'];
      break;

    case 'file':
      flowEntry.content = [node.data.filesData!.message];
      flowEntry.filesData = node.data.filesData!;
      break;

    case 'map':
      flowEntry.content = [node.data.mapData!.message];
      flowEntry.mapData = node.data.mapData!;
      break;

    case 'stop':
      break;

    default:
      console.warn(`Unknown node type: ${node.type}`);
  }

  return flowEntry;
}

export function generateChatbotFlow(reactflowData: ReactFlowData): ChatbotFlow {
  const { nodes, edges } = reactflowData;

  const flows: FlowEntry[] = [];
  const flowMap = new Map<string, FlowEntry>();

  nodes.forEach(node => {
    const flowEntry = transformNodeToFlow(node);
    flows.push(flowEntry);
    flowMap.set(node.id, flowEntry);
  });

  edges.forEach(edge => {
    const sourceFlow = flowMap.get(edge.source);
    const targetFlow = flowMap.get(edge.target);
    if (sourceFlow && targetFlow) {
      sourceFlow.nextFlowId = targetFlow.flowId;
    }
  });

  const startNode = nodes.find(node => node.type === 'start')!;
  const startFlowId = startNode.id;

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
    startFlowId,
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
