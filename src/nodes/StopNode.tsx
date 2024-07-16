import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

const StopNode: React.FC<NodeProps> = ({ data, id }) => {
  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="custom-node">
      <div className="custom-node-header">Stop
      <button className="closeButton remove-node" title="Delete Stop Node" onClick={() => onDelete(id)}>&times;</button>
      </div>
      <div className="custom-node-body">
        {data.stop ? data.stop : "The chat will stop here"}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default StopNode;
