import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const LeadFlowNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="custom-node">
      <div className="custom-node-header">Lead Flow</div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default LeadFlowNode;
