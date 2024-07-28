import React from "react";
import { Handle, Position } from "reactflow";
import { SubOption as SubOptionType } from "./../../models/common.models";

interface SubOptionProps {
  subOption: SubOptionType;
  index: number;
  onDelete: (index: number) => void;
  expandToEdit: () => void;
  length: number;
}

const SubOption: React.FC<SubOptionProps> = ({
  subOption,
  index,
  onDelete,
  expandToEdit,
  length,
}) => {
  return (
    <div
      className="flow-node bg-gray-700 text-white rounded-md p-1 mt-2"
      style={{
        width: "100%",
        padding: "4px 10px",
        border: "1px solid grey",
        borderRadius: "6px",
        margin: "10px 0",
        position: "relative",
      }}
    >
      <div className="flex justify-between items-center cursor-pointer grow">
        <div className="flex justify-between items-center grow min-w-0">
          <div className="flex min-w-0">
            <svg
              onClick={expandToEdit}
              className="min-w-4 w-4 h-4 mr-2 text-blue-300 cursor-pointer hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <strong className="text-sm grow text-ellipsis overflow-hidden whitespace-nowrap min-w-0">
              {subOption.title
                ? `${index + 1}. ${subOption.title}`
                : `${index + 1}. Sub Option`}
            </strong>
          </div>
        </div>
        {length > 1 && (
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-700 rounded-full min-w-4 h-4 w-4 text-xs flex items-center justify-center ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
          >
            &times;
          </button>
        )}
      </div>
      <Handle type="source" position={Position.Right} id={subOption.id} />
    </div>
  );
};

export default SubOption;
