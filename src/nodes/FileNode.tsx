import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { validateFiles } from "./../services/validation";
import "./toolStyles.css";

const FileNode: React.FC<NodeProps> = ({ id, data }) => {
  const { filesData, handleFileChange, onDelete } = data;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mimeType, setMimeType] = useState<string>("");

  const isValidURL = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", "i" // fragment locator
    );
    return !!urlPattern.test(url);
  };

  const handleFieldChange = (field: keyof typeof filesData, value: any) => {
    let updatedFilesData = { ...filesData, [field]: value };
    let newErrors: Record<string, string> = {};

    if (field === "url" && value && !isValidURL(value)) {
      newErrors.url = "Invalid URL format";
    }

    if (
      filesData.url === "" &&
      !validateFiles(filesData.files, filesData.fileType)
    ) {
      newErrors.files = "Uploaded files must match the selected file type";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleFileChange(id, updatedFilesData);
    }

    if (field === "fileType") {
      let type = getAcceptType(value);
      setMimeType(type);
    }
  };

  const getAcceptType = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "application/pdf";
      case "Images":
        return "image/*";
      case "Video":
        return "video/*";
      default:
        return "";
    }
  };

  return (
    <div className="custom-node file-node">
      <div className="custom-node-header d-flex justify-content-between align-items-center">
        <span>File Upload</span>
        <button
          title="Delete Option Node"
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
            value={filesData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Message"
          />
          {errors.message && <div className="error">{errors.message}</div>}
        </div>
        <div>
          <label>File Type:</label>
          <select
            value={filesData.fileType}
            onChange={(e) => handleFieldChange("fileType", e.target.value)}
          >
            <option value=""></option>
            <option value="PDF">PDF</option>
            <option value="Images">Images</option>
            <option value="Video">Video</option>
          </select>
          {errors.fileType && <div className="error">{errors.fileType}</div>}
        </div>
        <div>
          <label>Upload File:</label>
          <input
            type="file"
            accept={mimeType}
            multiple
            onChange={(e) =>
              handleFieldChange("files", Array.from(e.target.files || []))
            }
          />
          {errors.files && <div className="error">{errors.files}</div>}
        </div>
        <div className="mb-1">
          <label>URL:</label>
          <input
            type="text"
            value={filesData.url}
            onChange={(e) => handleFieldChange("url", e.target.value)}
          />
          {errors.url && <div className="error">{errors.url}</div>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FileNode;
