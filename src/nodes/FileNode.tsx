import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  validateFiles,
  validateFileNodeField,
} from "./../services/validation";
import { isValidURLStrict } from "../services/validation";

const FileNode: React.FC<NodeProps> = ({ id, data }) => {
  const { node, onDelete } = data;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mimeType, setMimeType] = useState<string>("application/pdf");

  const handleBlur = (field: keyof typeof node.data, value: string) => {
    const error = validateFileNodeField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleFieldChange = (field: keyof typeof node.data, value: any) => {
    const updatedFilesData = { ...node.data, [field]: value };
    node.data = updatedFilesData;

    // Reset URL if files are uploaded
    if (field === "files" && value.length > 0) {
      updatedFilesData.url = "";
      setErrors((prevErrors) => ({ ...prevErrors, url: "" }));
    }

    // Reset files if URL is provided
    if (field === "url" && value) {
      updatedFilesData.files = [];
      setErrors((prevErrors) => ({ ...prevErrors, files: "" }));
    }
    node.data = updatedFilesData;

    if (field === "fileType") {
      const type = getAcceptType(value);
      setMimeType(type);
    }
  };

  const getAcceptType = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "application/pdf";
      case "images":
        return "image/*";
      case "video":
        return "video/*";
      default:
        return "";
    }
  };

  return (
    <div className="flow-node bg-gray-800 text-white rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b pb-2 py-2 px-4 border-b-4 border-indigo-500">
        <span>File Upload</span>
        <button
          title="Delete File Node"
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="space-y-4 py-2 px-4 pb-3">
        <div className="mb-2" title="Message">
          <input
            type="text"
            placeholder="Message"
            value={node.data.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={(e) => handleBlur("message", e.target.value)}
            className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.message && (
            <small className="text-red-500">{errors.message}</small>
          )}
        </div>
        <div className="mb-2" title="File Type">
          <select
            value={node.data.fileType}
            onChange={(e) => handleFieldChange("fileType", e.target.value)}
            onBlur={(e) => handleBlur("fileType", e.target.value)}
            className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
          >
            <option value="pdf">PDF</option>
            <option value="images">Images</option>
            <option value="video">Video</option>
          </select>
          {errors.fileType && (
            <small className="text-red-500">{errors.fileType}</small>
          )}
        </div>
        <div className="mb-2">
          <label>Upload File:</label>
          <input
            disabled={!node.data.fileType || node.data.url !== ""}
            type="file"
            accept={mimeType}
            multiple
            onChange={(e) =>
              handleFieldChange("files", Array.from(e.target.files || []))
            }
            className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.files && (
            <small className="text-red-500">{errors.files}</small>
          )}
        </div>
        <div className="mb-1" title="URL">
          <input
            type="text"
            placeholder="URL"
            value={node.data.url}
            onChange={(e) => handleFieldChange("url", e.target.value)}
            onBlur={(e) => handleBlur("url", e.target.value)}
            disabled={node.data.files.length > 0}
            className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.url && <small className="text-red-500">{errors.url}</small>}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-white border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-white border-none"
      />
    </div>
  );
};

export default FileNode;
