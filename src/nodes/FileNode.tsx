import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { validateFiles } from "./../services/validation";
import "./toolStyles.css";

const FileNode: React.FC<NodeProps> = ({ data, id }) => {
  const { filesData, handleChange, handleFileChange, onDelete } = data;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    if (!validateFiles(filesData.files, filesData.fileType)) {
      setErrors({ files: "Uploaded files must match the selected file type" });
      return;
    }
    handleChange(id, filesData, "filesData");
  };

  return (
    <div className="custom-node file-node">
      <div className="custom-node-header">
        <span>File Upload</span>
        <button onClick={() => onDelete(id)}>X</button>
      </div>
      <div className="custom-node-body">
        <label>
          Message:
          <input
            type="text"
            value={filesData.message}
            onChange={(e) => handleChange(id, e.target.value, "message")}
          />
          {errors.message && <div className="error">{errors.message}</div>}
        </label>
        <label>
          File Type:
          <select
            value={filesData.fileType}
            onChange={(e) => handleChange(id, e.target.value, "fileType")}
          >
            <option value="PDF">PDF</option>
            <option value="Images">Images</option>
            <option value="Video">Video</option>
          </select>
          {errors.fileType && <div className="error">{errors.fileType}</div>}
        </label>
        <label>
          Upload File:
          <input
            type="file"
            multiple
            onChange={(e) =>
              handleFileChange(id, Array.from(e.target.files || []))
            }
          />
          {errors.files && <div className="error">{errors.files}</div>}
        </label>
        <label>
          or URL:
          <input
            type="text"
            value={filesData.url}
            onChange={(e) => handleChange(id, e.target.value, "url")}
          />
        </label>
        <button onClick={handleSave}>Save</button>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FileNode;
