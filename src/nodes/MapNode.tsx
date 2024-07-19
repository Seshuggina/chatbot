import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { isValidURL, isValidURLStrict } from "../services/validation";
import "./toolStyles.css";

const MapNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mapData, handleMapChange, onDelete } = data;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [url, setUrl] = useState(mapData.url);

  const handleFieldChange = (field: keyof typeof mapData, value: any) => {
    let updatedMapsData = { ...mapData, [field]: value };
    let newErrors: Record<string, string> = {};

    if (field === "message") {
      if (!value.trim()) {
        newErrors.message = "Message is required";
      } else if (value.length < 3) {
        newErrors.message = "Message must be at least 3 characters";
      } else if (value.length > 50) {
        newErrors.message = "Message must be less than 50 characters";
      }
    }
    if (field === "url") {
      if (!value.trim()) {
        newErrors.message = "URL is required";
      } else if (value && !isValidURLStrict(value)) {
        newErrors.url = "Invalid URL format";
      }
      // let abc = isValidURLStrict(value)
    }
    
    setErrors(newErrors);
    handleMapChange(id, updatedMapsData);
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
        <div title="Message:">
          <input
            type="text"
            value={mapData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Message:"
          />
          {errors.message && <small className="error">{errors.message}</small>}
        </div>
        <div title="Google Maps URL">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, url: "" }));
            }}
            onBlur={(e) => handleFieldChange("url", e.target.value)}
            placeholder="Google Maps URL:"
          />
          {errors.url && <small className="error">{errors.url}</small>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default MapNode;
