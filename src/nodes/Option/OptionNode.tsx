import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import Popup from "reactjs-popup";
import EditOptionsOnPopUp from "./EditOptions";
import { Option, SubOption as SubOptionType } from "../../models/common.models";
import { validateOptionField } from "../../services/validation";
import SubOption from "./SubOption";
import "./../../styles/tailwind.css";

const OptionNode: React.FC<any> = ({ data, id }) => {
  const { node, onDelete } = data;
  const [open, setOpen] = useState(false);
  const [isNodeCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [currentNodeData, setNodeData] = useState<Option>(node.data);

  const handleBlur = (field: string, value: string) => {
    const error = validateOptionField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleSubOptionBlur = (
    subOptionIndex: number,
    field: keyof SubOptionType,
    value: string
  ) => {
    const error = validateOptionField(field, value);
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      subOptions: {
        ...prevErrors.subOptions,
        [subOptionIndex]: {
          ...prevErrors.subOptions?.[subOptionIndex],
          [field]: error,
        },
      },
    }));
  };

  const handleInputChange = (field: keyof Option, value: string) => {
    const newData = { ...currentNodeData, [field]: value };
    setNodeData(newData);
    node.data = newData;
  };

  const handleSubOptionChange = (
    optionIndex: number,
    field: keyof SubOptionType,
    value: string
  ) => {
    const newSubOptions = [...currentNodeData.subOptions];
    newSubOptions[optionIndex][field] = value as never;
    const newData = { ...currentNodeData, subOptions: newSubOptions };
    setNodeData(newData);
    node.data = newData;
  };

  const handleAddSubOption = () => {
    const newSubOption: SubOptionType = {
      id: "",
      title: "",
      subTitle: "",
      value: "",
      category: "",
      leadEmailTo: "",
      leadEmailCc: "",
      isCollapsed: true,
    };

    const newData = {
      ...currentNodeData,
      subOptions: [...currentNodeData.subOptions, newSubOption],
    };

    setNodeData(newData);
    node.data = newData;
    setOpen(true);
  };

  const handleDeleteSubOption = (index: number) => {
    const newSubOptions = currentNodeData.subOptions.filter(
      (_, i) => i !== index
    );
    const newData = { ...currentNodeData, subOptions: newSubOptions };
    setNodeData(newData);
    node.data = newData;
  };

  const toggleSubOption = (index: number) => {
    const newSubOptions = currentNodeData.subOptions.map((subOption, i) =>
      i === index
        ? { ...subOption, isCollapsed: !subOption.isCollapsed }
        : subOption
    );
    const newData = { ...currentNodeData, subOptions: newSubOptions };
    setNodeData(newData);
    node.data = newData;
  };

  const savedPopupData = (modifiedNodeData: Option) => {
    const updatedNodeData = {
      ...modifiedNodeData,
      subOptions: modifiedNodeData.subOptions.map((sub) => ({
        ...sub,
        isCollapsed: true,
      })),
    };

    setNodeData(updatedNodeData);
    node.data = updatedNodeData;
  };

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  return (
    <>
      <div className="flow-node bg-gray-800 text-white rounded-md shadow-md ">
        <div className="flex justify-between items-center py-2 px-4 border-b-4 border-indigo-500">
          <strong
            className="cursor-pointer ml-3"
            onClick={() => setIsCollapsed(!isNodeCollapsed)}
          >
            Option
          </strong>

          <div className="flex">
            <button
              className="text-gray-400 hover:text-white mr-3"
              title="Expand"
              onClick={() => setOpen((o) => !o)}
            >
              <svg
                className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                fill="white"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 242.133 242.133"
              >
                <path
                  id="XMLID_15_"
                  d="M227.133,83.033c8.283,0,15-6.716,15-15V15c0-8.284-6.717-15-15-15H174.1c-8.284,0-15,6.716-15,15
	s6.716,15,15,15h16.82l-69.854,69.854L51.213,30h16.82c8.284,0,15-6.716,15-15s-6.716-15-15-15H15C6.717,0,0,6.716,0,15v53.033
	c0,8.284,6.717,15,15,15c8.285,0,15-6.716,15-15v-16.82l69.854,69.854L30,190.92V174.1c0-8.284-6.715-15-15-15
	c-8.283,0-15,6.716-15,15v53.033c0,8.284,6.717,15,15,15h53.033c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15h-16.82
	l69.854-69.854l69.854,69.854H174.1c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.033c8.283,0,15-6.716,15-15V174.1
	c0-8.284-6.717-15-15-15c-8.285,0-15,6.716-15,15v16.82l-69.854-69.854l69.854-69.854v16.82
	C212.133,76.317,218.848,83.033,227.133,83.033z"
                />
              </svg>
            </button>
            <button
              title="Delete Node"
              className="text-white font-semibold bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
              onClick={() => onDelete(id)}
            >
              &times;
            </button>
          </div>
        </div>
        {!isNodeCollapsed && (
          <div className="space-y-4 py-2 px-4">
            <div>
              <input
                type="text"
                placeholder="Display Text"
                value={currentNodeData.displayText}
                onChange={(e) =>
                  handleInputChange("displayText", e.target.value)
                }
                onBlur={(e) => handleBlur("displayText", e.target.value)}
                className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.displayText && (
                <small className="text-red-500">{errors.displayText}</small>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Property Name"
                value={currentNodeData.propertyName}
                onChange={(e) =>
                  handleInputChange("propertyName", e.target.value)
                }
                onBlur={(e) => handleBlur("propertyName", e.target.value)}
                className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.propertyName && (
                <small className="text-red-500">{errors.propertyName}</small>
              )}
            </div>
            <div>
              <input
                type="text"
                value={currentNodeData.message}
                placeholder="Message"
                onChange={(e) => handleInputChange("message", e.target.value)}
                onBlur={(e) => handleBlur("message", e.target.value)}
                className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.message && (
                <small className="text-red-500">{errors.message}</small>
              )}
            </div>
            <div>
              <input
                type="text"
                value={currentNodeData.fallback}
                placeholder="Fall back"
                onChange={(e) => handleInputChange("fallback", e.target.value)}
                onBlur={(e) => handleBlur("fallback", e.target.value)}
                className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.fallback && (
                <small className="text-red-500">{errors.fallback}</small>
              )}
            </div>
            {currentNodeData.subOptions.map((subOption, index) => (
              <SubOption
                key={index}
                subOption={subOption}
                index={index}
                onDelete={handleDeleteSubOption}
                length={currentNodeData.subOptions.length}
                expandToEdit={openModal}
              />
            ))}
            <button
              className="flex px-2 py-1 font-semibold text-white btn-primary-custom rounded items-center"
              onClick={handleAddSubOption}
            >
              <svg
                className="w-4 h-4 text-white font-semibold cursor-pointer hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add
            </button>
          </div>
        )}
        <Handle type="target" position={Position.Top} id={id} />
      </div>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <EditOptionsOnPopUp
          save={savedPopupData}
          optionsData={currentNodeData}
          close={closeModal}
        />
      </Popup>
    </>
  );
};

export default OptionNode;
