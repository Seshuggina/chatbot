import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const MessageNode: React.FC<NodeProps> = ({ data }) => {
  const { node, onDelete } = data;
  const [text, setText] = useState(node.data.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    node.data.text = newText;
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  return (
    <div className="flow-node bg-gray-800 text-white rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b pb-2 py-2 px-4 border-b-4 border-indigo-500">
        <span>Message</span>
        <button
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          title="Delete Message Node"
          onClick={() => onDelete(node.id)}
        >
          &times;
        </button>
      </div>
      <div className="space-y-4 py-2 px-4 pb-3 min-w-36">
        {isEditing ? (
          <input
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="Enter your message"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
        ) : (
          <div
            className="flex items-center space-x-2"
            onDoubleClick={handleDoubleClick}
          >
            {text ? text : "Enter your message"}
            <div onClick={handleDoubleClick}>
              <svg
                className="w-4 h-4 text-white cursor-pointer hover:text-white ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
              </svg>
            </div>
          </div>
        )}
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

export default MessageNode;
