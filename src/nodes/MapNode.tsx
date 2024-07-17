// GoogleMapsNode.tsx
import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { isValidURL } from "../services/validation";
import "./toolStyles.css";

const MapNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mapData, handleMapChange, onDelete } = data;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [url, setUrl] = useState(mapData.url);

  const handleFieldChange = (field: keyof typeof mapData, value: any) => {
    let updatedMapsData = { ...mapData, [field]: value };
    let newErrors: Record<string, string> = {};

    if (field === "url" && value && !isValidURL(value)) {
      newErrors.url = "Invalid URL format";
    }

    setErrors(newErrors);
    handleMapChange(id, updatedMapsData);
    // if (Object.keys(newErrors).length === 0) {
      
    // }
  };

  return (
    <div className="custom-node maps-node">
      <div className="custom-node-header d-flex justify-content-between align-items-center">
        <span>Google Maps</span>
        <button
          title="Delete Node"
          className="closeButton remove-node"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="custom-node-body">
        <div>
          <label>Message:</label>
          <input
            type="text"
            value={mapData.text}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Message"
          />
          {errors.message && <div className="error">{errors.message}</div>}
        </div>
        <div>
          <label>Google Maps URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) =>{setUrl(e.target.value); setErrors({})}}
            onBlur={(e) => handleFieldChange("url", e.target.value)}
          />
          {errors.url && <div className="error">{errors.url}</div>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default MapNode;
