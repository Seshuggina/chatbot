import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import 'tailwindcss/tailwind.css';

const GPTHandlerNode: React.FC<NodeProps> = ({ data, id }) => {
  const { onDelete } = data;

  return (
    <div className="flow-node bg-gray-800 text-white rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b pb-2 py-2 px-4 border-b-4 border-indigo-500">
        <h3 className="text-lg font-semibold">GPT Handler</h3>
        <button
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          title="Delete GPT Handler Node"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="space-y-4 py-2 px-4 pb-3">
        <div>
          {data.text ? data.text : "From here on visitors would be handled by GPT"}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white border-none"
      />
    </div>
  );
};

export default GPTHandlerNode;
