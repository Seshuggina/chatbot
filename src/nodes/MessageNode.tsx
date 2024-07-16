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
    <div className="custom-node message-node">
      <div className="custom-node-header">
        Message
        <button className="closeButton remove-node" title="Delete Message Node" onClick={() => onDelete(id)}>&times;</button>
      </div>
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
