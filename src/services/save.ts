// Define types
interface Node {
    id: string;
    type: string;
    data: any;
    position: { x: number; y: number };
  }
  
  interface Edge {
    source: string;
    target: string;
  }
  
  interface ReactFlowData {
    nodes: Node[];
    edges: Edge[];
  }
  
  interface BotFlow {
    flowId: string;
    nextFlowId?: string;
    type: string;
    content: string[];
    children: any[];
    _id: { $oid: string };
  }
  
  interface BotFlowData {
    _id: { $oid: string };
    organizationId: { $oid: string };
    botId: { $oid: string };
    mode: any[];
    createdAt: { $date: string };
    version: number;
    startFlowId: string;
    flows: BotFlow[];
    __v: number;
    deployedAt: { $date: string };
    modifiedAt: { $date: string };
  }
  
  interface VersionData {
    reactFlow: ReactFlowData;
    botFlow: BotFlowData;
  }
  
  // Utility functions
  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  const getFromLocalStorage = (key: string): any => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  
  const generateUniqueKey = (baseKey: string): string => {
    let counter = 1;
    let key = `${baseKey}${counter}`;
    while (localStorage.getItem(key)) {
      counter++;
      key = `${baseKey}${counter}`;
    }
    return key;
  };
  
  // Save reactflow data as drafts
  export const saveDraft = (reactFlowData: ReactFlowData): void => {
    const draftKey = generateUniqueKey('draft');
    saveToLocalStorage(draftKey, reactFlowData);
  };
  
  // Save botflow and reactflow data as versions
  export const saveVersion = (reactFlowData: ReactFlowData, botFlowData: any): void => {
    const versionKey = generateUniqueKey('version');
    const versionData: VersionData = { reactFlow: reactFlowData, botFlow: botFlowData };
    saveToLocalStorage(versionKey, versionData);
  };
  
  // Get and return the draft data
  export const getDrafts = (): ReactFlowData[] => {
    const drafts: ReactFlowData[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('draft')) {
        const draft = getFromLocalStorage(key);
        if (draft) drafts.push(draft);
      }
    });
    return drafts;
  };
  
  // Get and return the versions data
  export const getVersions = (): VersionData[] => {
    const versions: VersionData[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('version')) {
        const version = getFromLocalStorage(key);
        if (version) versions.push(version);
      }
    });
    return versions;
  };
  