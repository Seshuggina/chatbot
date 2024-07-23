import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Popup from "reactjs-popup";
import EditOptionsOnPopUp from "./../EditOptions";
import {
  Option,
  SubOption as SubOptionType,
} from "./../../models/common.models";
import { validateOptionField } from "./../../services/validateOptions";
import SubOption from "./SubOption";
import "./../../styles/tailwind.css"; // Make sure to import Tailwind CSS

const MainOption: React.FC<NodeProps> = ({ data, id }) => {
  const optionData = data.options;
  const [open, setOpen] = useState(false);
  const [isOptionCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [options, setOptions] = useState<Option>(optionData);

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
    const newOptions = { ...options, [field]: value };
    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
  };

  const handleSubOptionChange = (
    optionIndex: number,
    field: keyof SubOptionType,
    value: string
  ) => {
    const newSubOptions = [...options.subOptions];
    newSubOptions[optionIndex][field] = value as never;
    const newOptions = { ...options, subOptions: newSubOptions };
    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
  };

  const handleAddSubOption = () => {
    const newSubOption: SubOptionType = {
      title: "",
      subTitle: "",
      value: "",
      category: "",
      leadEmailTo: "",
      leadEmailCc: "",
      isCollapsed: true,
    };

    const newOptions = {
      ...options,
      subOptions: [...options.subOptions, newSubOption],
    };

    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
    setOpen(true);
  };

  const handleDeleteSubOption = (index: number) => {
    const newSubOptions = options.subOptions.filter((_, i) => i !== index);
    const newOptions = { ...options, subOptions: newSubOptions };
    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
  };

  const toggleSubOption = (index: number) => {
    const newSubOptions = options.subOptions.map((subOption, i) =>
      i === index
        ? { ...subOption, isCollapsed: !subOption.isCollapsed }
        : subOption
    );
    setOptions({ ...options, subOptions: newSubOptions });
    data.handleChange(id, { ...options, subOptions: newSubOptions }, "options");
  };

  const savedPopupData = (modifiedOptions: Option) => {
    const updatedOptions = {
      ...modifiedOptions,
      subOptions: modifiedOptions.subOptions.map((sub) => ({
        ...sub,
        isCollapsed: true,
      })),
    };

    setOptions(updatedOptions);
    data.handleChange(id, updatedOptions, "options");
  };

  const onDelete = (id: any) => {
    data.onDelete(id);
  };

  const closeModal = () => setOpen(false);

  return (
    <>
      <div className="bg-gray-800 text-white rounded-md shadow-md ">
        <div className="flex justify-between items-center mb-2 py-2 px-4 border-b-4 border-indigo-500">
          <div className="flex">
            <strong
              className="cursor-pointer"
              onClick={() => setIsCollapsed(!isOptionCollapsed)}
            >
              Options
            </strong>
            <button
              className="text-gray-400 hover:text-white"
              title="Expand"
              onClick={() => setOpen((o) => !o)}
            >
              <svg
                className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </button>
          </div>
          <button
            title="Delete Option Node"
            className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
            onClick={() => onDelete(id)}
          >
            &times;
          </button>
        </div>
        {!isOptionCollapsed && (
          <div className="space-y-4 py-2 px-4">
            <div>
              <input
                type="text"
                placeholder="Display Text"
                value={options.displayText}
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
                value={options.propertyName}
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
                value={options.message}
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
                value={options.fallback}
                placeholder="Fall back"
                onChange={(e) => handleInputChange("fallback", e.target.value)}
                onBlur={(e) => handleBlur("fallback", e.target.value)}
                className="w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.fallback && (
                <small className="text-red-500">{errors.fallback}</small>
              )}
            </div>
            {options.subOptions.map((subOption, index) => (
              <SubOption
                key={index}
                subOption={subOption}
                index={index}
                errors={errors.subOptions?.[index] || {}}
                onBlur={handleSubOptionBlur}
                onChange={handleSubOptionChange}
                onDelete={handleDeleteSubOption}
                toggleSubOption={toggleSubOption}
                length={options.subOptions.length}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add
            </button>
          </div>
        )}
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <EditOptionsOnPopUp
          save={savedPopupData}
          optionsData={options}
          close={closeModal}
        />
      </Popup>
    </>
  );
};

export default MainOption;
