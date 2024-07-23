import React, { useCallback, useEffect, useState } from "react";
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
import "./App.scss";
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
import OptionsNode from "./nodes/OptionsNode";
import LeadFormNode from "./nodes/LeadFormNode";
import LeadFlowNode from "./nodes/LeadFlowNode";
import GPTHandlerNode from "./nodes/GPTHandlerNode";
import StopNode from "./nodes/StopNode";
import StartNode from "./nodes/StartNode";
import FileNode from "./nodes/FileNode";
import MapNode from "./nodes/MapNode";
import MainOption from "./nodes/Option/MainOption";

//Edges
import CustomEdge from "./edges/CustomEdge";
import { saveDraft, saveVersion } from "./services/save";
import FlowDropdown from "./component/FlowDropdown";
import Toolbar from "./component/Toolbar"; // Import the Toolbar component

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  options: MainOption,
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
    id: "1",
    type: "start",
    data: { text: "Welcome to LivServ" },
    position: { x: 250, y: 5 },
  },
];

const FlowDiagram: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { text: "" }, // Default data for all nodes

        // Set data field based on type
        ...(type === "options" && {
          data: {
            text: "",
            options: {
              displayText: "",
              propertyName: "",
              message: "",
              fallback: "",
              subOptions: [
                {
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
          },
        }),

        ...(type === "file" && {
          data: {
            text: "",
            filesData: {
              message: "",
              fileType: "pdf",
              url: "",
              files: [],
            },
          },
        }),

        ...(type === "map" && {
          data: {
            text: "",
            mapData: {
              message: "",
              url: "",
            },
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
      if (nodeDetails.type === "options") {
        const errors = validateOptions(nodeDetails.data.options);
        allErrors = { ...allErrors, ...errors };
      } else if (nodeDetails.type === "file") {
        const errors = validateFileNode(nodeDetails.data.filesData);
        allErrors = { ...allErrors, ...errors };
      } else if (nodeDetails.type === "map") {
        const errors = validateMapNode(nodeDetails.data.mapData);
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
  };

  const handleNodeChange = (id: string, newData: any, nodeType: string) => {
    resetFlags();
    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...(nodeType === "options"
              ? { options: newData }
              : { text: newData }),
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    console.log("updated Nodes", nodes);
  };

  const handleFileChange = useCallback((id: string, files: File[]) => {
    resetFlags();
    console.log("files", files);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            filesData: {
              ...files,
            },
          };
        }
        return node;
      })
    );
  }, []);

  const handleMapChange = useCallback((id: string, newData: any) => {
    resetFlags();
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          console.log("nodenode Maps", node);

          node.data = {
            ...node.data,
            mapData: {
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, []);

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
                  ...node.data,
                  handleChange: handleNodeChange,
                  onDelete: handleDeleteNode,
                  handleFileChange: handleFileChange,
                  handleMapChange: handleMapChange,
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
              <MiniMap />
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
          <div className="alert alert-danger alert-close" role="alert">
            <button
              data-dismiss="alert"
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
