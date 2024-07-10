import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./toolStyles.css";

const StartNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="custom-node message-node">
      <div className="custom-node-body">{data.text}</div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default StartNode;
