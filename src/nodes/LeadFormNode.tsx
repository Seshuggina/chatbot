import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const LeadFormNode: React.FC<NodeProps> = ({ data, id }) => {
  return (
    <div className="custom-node">
      <div className="custom-node-header">Lead Form</div>
      <div className="custom-node-body">
        <div>{data.text ? data.text : "This will display lead form for the visitor"}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default LeadFormNode;
