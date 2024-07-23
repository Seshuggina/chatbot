import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./toolStyles.css";
import "./../styles/node.scss";

const MessageNode: React.FC<NodeProps> = ({ data, id }) => {
  const [text, setText] = useState(data.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    data.handleChange(id, newText);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
        <span>Message</span>
        <button
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          title="Delete Message Node"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="custom-node-body">
        {isEditing ? (
          <input
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="Enter your message"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            {text ? text : "Enter your message"}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white border-none" />
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white border-none" />
    </div>
  );
};

export default MessageNode;
