import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const LeadFormNode: React.FC<NodeProps> = ({ data, id }) => {

  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="custom-node">
      <div className="custom-node-header">
        Lead Form
        <button
          title="Delete Lead Form Node"
          className="closeButton remove-node"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="custom-node-body">
        <div>
          {data.text
            ? data.text
            : "This will display lead form for the visitor"}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default LeadFormNode;
