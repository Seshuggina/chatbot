import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import 'tailwindcss/tailwind.css';

const LeadFormNode: React.FC<NodeProps> = ({ data, id }) => {

  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="bg-gray-800 text-white rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2flex justify-between items-center py-2 px-4 border-b-4 border-indigo-500">
        <h3 className="text-lg font-semibold">Lead Form</h3>
        <button
          title="Delete Lead Form Node"
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="space-y-4 py-2 px-4 pb-3">
        <p>
          {data.text
            ? data.text
            : "This will display lead form for the visitor"}
        </p>
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

export default LeadFormNode;
