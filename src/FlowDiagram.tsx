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
  isNode,
  isEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles/button.scss";
import "./App.scss";

//Nodes
import MessageNode from "./nodes/MessageNode";
import OptionsNode from "./nodes/OptionsNode";
import LeadFormNode from "./nodes/LeadFormNode";
import LeadFlowNode from "./nodes/LeadFlowNode";
import GPTHandlerNode from "./nodes/GPTHandlerNode";
import StopNode from "./nodes/StopNode";
import StartNode from "./nodes/StartNode";

//Edges
import CustomEdge from "./edges/CustomEdge";

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  options: OptionsNode,
  leadForm: LeadFormNode,
  leadFlow: LeadFlowNode,
  gptHandler: GPTHandlerNode,
  stop: StopNode,
};

const edgeTypes = {
  custom: CustomEdge, // Add the custom edge
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
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // const onConnect = useCallback(
  //   (params: any) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // );

  const onConnect = (params: any) =>
    setEdges((eds) => addEdge({ ...params, type: "custom" }, eds));

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
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
        data: {
          text: "",
          options: [
            {
              displayText: "",
              propertyName: "",
              message: "",
              subOptions: [
                {
                  title: "",
                  subTitle: "",
                  value: "",
                  leadEmail: { to: "", cc: "" },
                },
              ],
            },
          ],
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  const handleSave = () => {
    const flow = {
      nodes,
      edges,
    };
    console.log("Saved Flow:", JSON.stringify(flow, null, 2));
  };

  const handleNodeChange = (id: string, newData: any, nodeType: string) => {
    let updatedNode = nodes.find((nds) => nds.id === id);
    let updatedObject = {};
    if (updatedNode) {
      if (nodeType === "options") {
        updatedObject = {
          ...updatedNode,
          data: {
            ...updatedNode?.data,
            options: newData,
          },
        };
      } else {
        updatedObject = {
          ...updatedNode,
          data: {
            ...updatedNode?.data,
            text: newData,
          },
        };
      }

      const updatedNodes = nodes.map((item) => {
        if (item.id === id) {
          return { ...item, ...updatedObject };
        } else {
          return item;
        }
      });
      setNodes(updatedNodes);
    }
    console.log("updatedObject", nodes);

    // setNodes((nds) =>
    //   nds.map((node) =>
    //     node.id === id
    //       ? {
    //           ...node,
    //           data: {
    //             ...node.data,
    //             ...(nodeType === "options"
    //               ? { options: newData.options }
    //               : { text: newData.text }),
    //           },
    //         }
    //       : node
    //   )
    // );
    console.log("updated Nodes", nodes);
  };

  const onNodesDelete = useCallback(
    (deleted: any) => {
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

  return (
    <>
      <div className="flow-diagram">
        <div className="toolbar">
          <div className="">
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "message")
              }
              draggable
            >
              Message
            </button>
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "options")
              }
              draggable
            >
              Options
            </button>
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "leadForm")
              }
              draggable
            >
              Lead Form
            </button>
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "leadFlow")
              }
              draggable
            >
              Lead Flow
            </button>
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData(
                  "application/reactflow",
                  "gptHandler"
                )
              }
              draggable
            >
              GPT Handler
            </button>
            <button
              className="button"
              onDragStart={(event) =>
                event.dataTransfer.setData("application/reactflow", "stop")
              }
              draggable
            >
              Stop
            </button>
          </div>
        </div>
        <div
          className="reactflow-wrapper"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: { ...node.data, handleChange: handleNodeChange },
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
      </div>
      <div className="action-flow-wrap">
        <div className="">
          Versions:{" "}
          <select>
            <option></option>
            <option>Version 1</option>
            <option>Version 2</option>
          </select>
          <button className="button-primary" onClick={handleSave}>
            Deploy
          </button>
        </div>
        <div className="">
          <button className="button-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default FlowDiagram;
