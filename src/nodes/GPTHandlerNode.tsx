import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const GPTHandlerNode: React.FC<NodeProps> = ({ data, id }) => {
  return (
    <div className="custom-node">
      <div className="custom-node-header">GPT Handler</div>
      <div className="custom-node-body">
        <div>
          {data.text
            ? data.text
            : "From Here on visitors would be handled by GPT"}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default GPTHandlerNode;
