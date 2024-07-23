import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./toolStyles.css";

const StartNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg">
      <div className="custom-node-body">{data.text}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-white border-none"
      />
    </div>
  );
};

export default StartNode;
