import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const StartNode: React.FC<NodeProps> = ({ data }) => {
  const { node } = data;
  return (
    <div className="flow-node bg-gray-800 text-white p-2 rounded-md shadow-lg">
      <div className="custom-node-body">{node.data.text}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-white border-none"
      />
    </div>
  );
};

export default StartNode;
