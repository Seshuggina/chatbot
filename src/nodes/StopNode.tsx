import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const StopNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="custom-node">
      <div className="custom-node-header">Stop</div>
      <div className="custom-node-body">
        {data.stop ? data.stop : "The chat will stop here"}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default StopNode;
