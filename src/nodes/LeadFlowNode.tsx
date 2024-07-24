import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "tailwindcss/tailwind.css";

const LeadFlowNode: React.FC<NodeProps> = ({ data, id }) => {
  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="bg-gray-800 text-white rounded-md shadow-lg">
      <div className="flex justify-between items-center pb-2 py-2 px-4">
        <h3 className="text-lg font-semibold mr-2">Lead Flow</h3>
        <button
          title="Delete Lead Flow Node"
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center ml-3"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-white border-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-white border-none"
      />
    </div>
  );
};

export default LeadFlowNode;
