import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { isValidURLStrict } from "../services/validation";

const MapNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mapData, handleMapChange, onDelete } = data;
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        newErrors.url = "URL is required";
      } else if (value && !isValidURLStrict(value)) {
        newErrors.url = "Invalid URL format";
      }
    }
    
    setErrors(newErrors);
    handleMapChange(id, updatedMapsData);
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span>Google Maps</span>
        <button
          title="Delete Node"
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="custom-node-body">
        <div className="mb-2">
          <input
            type="text"
            value={mapData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Message:"
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white"
          />
          {errors.message && <small className="text-red-500">{errors.message}</small>}
        </div>
        <div>
          <input
            type="text"
            value={mapData.url}
            onChange={(e) => handleFieldChange("url", e.target.value)}
            onBlur={(e) => handleFieldChange("url", e.target.value)}
            placeholder="Google Maps URL:"
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white"
          />
          {errors.url && <small className="text-red-500">{errors.url}</small>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white border-none" />
    </div>
  );
};

export default MapNode;
