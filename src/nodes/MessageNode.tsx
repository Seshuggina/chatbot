import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./toolStyles.css";

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

  return (
    <div className="custom-node message-node">
      <div className="custom-node-header">Message</div>
      <div className="custom-node-body">
        {isEditing ? (
          <input
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="Enter your message"
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            {text ? text : "Enter your message"}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default MessageNode;
