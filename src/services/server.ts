import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Define the types for FlowEntry, ChatbotFlow, and the API response
type FlowEntry = {
  flowId: string;
  nextFlowId: string | null;
  type: string;
  content: string[];
  children: any[];
  _id: {
    $oid: string;
  };
  property?: string;
  displayText?: string;
  fallback?: string;
  filesData?: any;
  mapData?: any;
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

export const saveFlowData = async (flowData: ChatbotFlow): Promise<ChatbotFlow> => {
  try {
    const response = await axios.post<ChatbotFlow>(`${API_URL}/save-flow`, flowData);
    return response.data;
  } catch (error) {
    console.error('Error saving flow:', error);
    throw error;
  }
};
