import React from "react";
import { Handle, Position } from "reactflow";
import { SubOption as SubOptionType } from "./../../models/common.models";

interface SubOptionProps {
  subOption: SubOptionType;
  index: number;
  errors: Record<string, any>;
  onBlur: (
    subOptionIndex: number,
    field: keyof SubOptionType,
    value: string
  ) => void;
  onChange: (
    optionIndex: number,
    field: keyof SubOptionType,
    value: string
  ) => void;
  onDelete: (index: number) => void;
  toggleSubOption: (index: number) => void;
  length: number;
}

const SubOption: React.FC<SubOptionProps> = ({
  subOption,
  index,
  errors,
  onBlur,
  onChange,
  onDelete,
  toggleSubOption,
  length,
}) => {
  return (
    <div className="bg-gray-700 text-white rounded-md p-1 mt-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSubOption(index)}
      >
        <div className="flex items-center">
          {/* Accordion Icon */}
          {subOption.isCollapsed ? (
            <svg
              className="w-5 h-5 text-gray-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          )}
          <strong>
            {subOption.title
              ? `#${index + 1} - ${subOption.title}`
              : `#${index + 1} Sub Option`}
          </strong>
        </div>
        {length > 1 && (
          <button
            title="Delete Option"
            className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling up to the header
              onDelete(index);
            }}
          >
            &times;
          </button>
        )}
      </div>

      {!subOption.isCollapsed && (
        <div className="space-y-4 py-2">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={subOption.title}
              onChange={(e) => onChange(index, "title", e.target.value)}
              onBlur={(e) => onBlur(index, "title", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            />
            {errors.title && (
              <small className="text-red-500">{errors.title}</small>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Sub Title"
              value={subOption.subTitle}
              onChange={(e) => onChange(index, "subTitle", e.target.value)}
              onBlur={(e) => onBlur(index, "subTitle", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            />
            {errors.subTitle && (
              <small className="text-red-500">{errors.subTitle}</small>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Value"
              value={subOption.value}
              onChange={(e) => onChange(index, "value", e.target.value)}
              onBlur={(e) => onBlur(index, "value", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            />
            {errors.value && (
              <small className="text-red-500">{errors.value}</small>
            )}
          </div>
          <div>
            <select
              value={subOption.category}
              onChange={(e) => onChange(index, "category", e.target.value)}
              onBlur={(e) => onBlur(index, "category", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            >
              <option value="">Select Category</option>
              <option value="presale">Presale</option>
              <option value="general">General</option>
              <option value="others">Others</option>
            </select>
            {errors.category && (
              <small className="text-red-500">{errors.category}</small>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Lead Email To"
              value={subOption.leadEmailTo}
              onChange={(e) => onChange(index, "leadEmailTo", e.target.value)}
              onBlur={(e) => onBlur(index, "leadEmailTo", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            />
            {errors.leadEmailTo && (
              <small className="text-red-500">{errors.leadEmailTo}</small>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Lead Email Cc"
              value={subOption.leadEmailCc}
              onChange={(e) => onChange(index, "leadEmailCc", e.target.value)}
              onBlur={(e) => onBlur(index, "leadEmailCc", e.target.value)}
              className="w-full p-1 border border-gray-600 bg-gray-800 text-white rounded text-sm"
            />
            {errors.leadEmailCc && (
              <small className="text-red-500">{errors.leadEmailCc}</small>
            )}
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default SubOption;
