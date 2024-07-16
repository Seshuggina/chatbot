import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const LeadFlowNode: React.FC<NodeProps> = ({ data, id }) => {
  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="custom-node">
      <div className="custom-node-header">
        Lead Flow
        <button
          title="Delete Lead Flow Node"
          className="closeButton remove-node"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default LeadFlowNode;
