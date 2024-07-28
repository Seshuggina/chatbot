import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles/button.scss";
import "./FlowDiagram.scss";
import {
  validateOptions,
  validateFileNode,
  validateMapNode,
} from "./services/validation";
import ValidationMessages from "./component/ValidationMessages";
import { generateChatbotFlow } from "./services/chatbot-flow";
import {
  ReactFlowNode,
  ReactFlowEdge,
  ReactFlowData,
} from "./models/common.models";
import useGlobalStore from "./services/glaboalStore";

//Nodes
import MessageNode from "./nodes/MessageNode";
import LeadFormNode from "./nodes/LeadFormNode";
import LeadFlowNode from "./nodes/LeadFlowNode";
import GPTHandlerNode from "./nodes/GPTHandlerNode";
import StopNode from "./nodes/StopNode";
import StartNode from "./nodes/StartNode";
import FileNode from "./nodes/FileNode";
import MapNode from "./nodes/MapNode";
import OptionNode from "./nodes/Option/OptionNode";

//Edges
import CustomEdge from "./edges/CustomEdge";
import { saveDraft, saveVersion } from "./services/save";
import FlowDropdown from "./component/FlowDropdown";
import Toolbar from "./component/Toolbar"; // Import the Toolbar component
import { saveFlowData } from "./services/server";
import { getId } from "./services/utilities";

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  option: OptionNode,
  leadForm: LeadFormNode,
  leadFlow: LeadFlowNode,
  gptHandler: GPTHandlerNode,
  stop: StopNode,
  file: FileNode,
  map: MapNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  {
    id: getId(),
    type: "start",
    data: { text: "Welcome to LivServ" },
    position: { x: 250, y: 5 },
  },
];
const FlowDiagram: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const { valid, setValid } = useGlobalStore();

  const resetFlags = () => {
    setErrors({});
    setShowErrors(false);
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    resetFlags();
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    resetFlags();
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = (params: any) => {
    resetFlags();
    setEdges((eds) => addEdge({ ...params, type: "custom" }, eds));
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      resetFlags();
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { text: "" }, // Default data for all nodes
        // Option NOde
        ...(type === "option" && {
          data: {
            displayText: "",
            propertyName: "",
            message: "",
            fallback: "",
            subOptions: [
              {
                id: getId(),
                title: "",
                subTitle: "",
                value: "",
                leadEmailTo: "",
                leadEmailCc: "",
                category: "",
                isCollapsed: true,
              },
            ],
          },
        }),
        // File Node
        ...(type === "file" && {
          data: {
            message: "",
            fileType: "pdf",
            url: "",
            files: [],
          },
        }),
        // Map Node
        ...(type === "map" && {
          data: {
            message: "",
            url: "",
          },
        }),
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  const handleSave = () => {
    if (nodes.length < 2) {
      const newErrors: Record<string, string> = {};
      newErrors.MinNodes = "Minimum 2 nodes required for a valid flow";
      setErrors(newErrors);
      setShowErrors(true);
      return false;
    }

    let allErrors: Record<string, string> = {};

    for (const nodeDetails of nodes) {
      if (nodeDetails.type === "option") {
        const errors = validateOptions(nodeDetails.data);
        allErrors = { ...allErrors, ...errors };
      } else if (nodeDetails.type === "file") {
        const errors = validateFileNode(nodeDetails.data);
        allErrors = { ...allErrors, ...errors };
      } else if (nodeDetails.type === "map") {
        const errors = validateMapNode(nodeDetails.data);
        allErrors = { ...allErrors, ...errors };
      }
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setShowErrors(true);
      return;
    }

    const flow: ReactFlowData = {
      nodes,
      edges,
    };
    console.log("Saved Flow:", JSON.stringify(flow, null, 2));
    const flowData = generateChatbotFlow(flow);
    saveDraft(flow);
    saveVersion(flow, flowData);
    saveFlowData(flowData);
  };

  const handleNodeChange = (newNode: Node) => {
    resetFlags();
    const updatedNodes = nodes.map((node) => {
      if (node.id === newNode.id) {
        console.log("node", node);
        debugger;
        return {
          ...node,
          data: {
            ...newNode.data,
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    console.log("updated Nodes", nodes);
  };

  const handleDeleteNode = (id: string) => {
    resetFlags();
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  const onNodesDelete = useCallback(
    (deleted: any) => {
      resetFlags();
      setEdges(
        deleted.reduce((acc: any, node: any) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge: any) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const renderSelectedFlow = () => {};

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
  };

  return (
    <>
      <div className="flow-diagram">
        <div className="sidebar"></div>
        <div
          className="reactflow-wrapper"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  node: node,
                  nodes: nodes,
                  handleChange: handleNodeChange,
                  onDelete: handleDeleteNode,
                },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesDelete={onNodesDelete}
            >

              <Controls />
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        <div className="toolbar">
          <Toolbar onDragStart={onDragStart} />
          <div className="mt-5">
            <button
              disabled={Object.keys(errors).length > 0}
              className="px-2 py-2 font-semibold text-white btn-primary-custom rounded items-center text-center"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="action-flow-wrap">
        <div className="d-flex">
          <FlowDropdown dropdownChange={renderSelectedFlow} />
        </div>

        {showErrors && (
          <div className="bg-red-100 p-3" role="alert">
          <button
            className="col-span-full text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
            aria-label="close"
            title="close"
            onClick={() => setShowErrors(false)}
          >
            &times;
          </button>
        
          <ValidationMessages messages={errors} />
        </div>
        
        )}
      </div>
    </>
  );
};

export default FlowDiagram;
