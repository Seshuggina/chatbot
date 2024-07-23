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

  return (
    <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
        <span>File Upload</span>
        <button
          title="Delete File Node"
          className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
          onClick={() => onDelete(id)}
        >
          &times;
        </button>
      </div>
      <div className="custom-node-body">
        <div className="mb-2" title="Message">
          <input
            type="text"
            placeholder="Message"
            value={filesData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={(e) => handleBlur("message", e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.message && <small className="text-red-500">{errors.message}</small>}
        </div>
        <div className="mb-2" title="File Type">
          <select
            value={filesData.fileType}
            onChange={(e) => handleFieldChange("fileType", e.target.value)}
            onBlur={(e) => handleBlur("fileType", e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          >
            <option value="pdf">PDF</option>
            <option value="images">Images</option>
            <option value="video">Video</option>
          </select>
          {errors.fileType && <small className="text-red-500">{errors.fileType}</small>}
        </div>
        <div className="mb-2">
          <label>Upload File:</label>
          <input
            disabled={!filesData.fileType || filesData.url !== ""}
            type="file"
            accept={mimeType}
            multiple
            onChange={(e) => handleFieldChange("files", Array.from(e.target.files || []))}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.files && <small className="text-red-500">{errors.files}</small>}
        </div>
        <div className="mb-1" title="URL">
          <input
            type="text"
            placeholder="URL"
            value={filesData.url}
            onChange={(e) => handleFieldChange("url", e.target.value)}
            onBlur={(e) => handleBlur("url", e.target.value)}
            disabled={filesData.files.length > 0}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
          {errors.url && <small className="text-red-500">{errors.url}</small>}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white border-none" />
    </div>
  );
};

export default FileNode;
