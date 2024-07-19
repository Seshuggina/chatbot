import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { validateFiles, validateFileNodeField } from "./../services/validateOptions";
import { isValidURLStrict } from "../services/validation";
import "./toolStyles.css";

const FileNode: React.FC<NodeProps> = ({ id, data }) => {
  const { filesData, handleFileChange, onDelete } = data;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mimeType, setMimeType] = useState<string>("application/pdf");


  const handleBlur = (field: keyof typeof filesData, value: string) => {
    const error = validateFileNodeField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleFieldChange = (field: keyof typeof filesData, value: any) => {
    const updatedFilesData = { ...filesData, [field]: value };

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

    handleFileChange(id, updatedFilesData);

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

  const handleSave = () => {
    const messageError = validateFileNodeField("message", filesData.message);
    const urlError = isValidURLStrict(filesData.url)
      ? ""
      : "Please enter a valid URL";
    const fileTypeError = validateFileNodeField("fileType", filesData.fileType);
    const filesError =
      filesData.url === "" &&
      !validateFiles(filesData.files, filesData.fileType)
        ? "Uploaded files must match the selected file type"
        : "";

    setErrors({
      message: messageError,
      fileType: fileTypeError,
      files: filesError,
      url: filesData.files.length === 0 ? urlError : "",
    });

    if (messageError || fileTypeError || filesError || urlError) {
      return;
    }

    handleFileChange(id, filesData, "filesData");
  };

  const isValidURL = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(url);
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
        <div title="Message">
          <input
            type="text"
            placeholder="Message"
            value={filesData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={(e) => handleBlur("message", e.target.value)}
          />
          {errors.message && <small className="error">{errors.message}</small>}
        </div>
        <div title="File Type">
          <select
            value={filesData.fileType}
            onChange={(e) => handleFieldChange("fileType", e.target.value)}
            onBlur={(e) => handleBlur("fileType", e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="images">Images</option>
            <option value="video">Video</option>
          </select>
          {errors.fileType && (
            <small className="error">{errors.fileType}</small>
          )}
        </div>
        <div>
          <label>Upload File:</label>
          <input
            disabled={!filesData.fileType || filesData.url !== ""}
            type="file"
            accept={mimeType}
            multiple
            onChange={(e) =>
              handleFieldChange("files", Array.from(e.target.files || []))
            }
          />
          {errors.files && <small className="error">{errors.files}</small>}
        </div>
        <div className="mb-1" title="URL">
          <input
            type="text"
            placeholder="URL"
            value={filesData.url}
            onChange={(e) => handleFieldChange("url", e.target.value)}
            onBlur={(e) => handleBlur("url", e.target.value)}
            disabled={filesData.files.length > 0}
          />
          {errors.url && <small className="error">{errors.url}</small>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FileNode;
