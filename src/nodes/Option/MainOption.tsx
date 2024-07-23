import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Popup from "reactjs-popup";
import EditOptionsOnPopUp from "./../EditOptions";
import { Option, SubOption as SubOptionType } from "./../../models/common.models";
import { validateOptionField } from "./../../services/validateOptions";
import SubOption from "./SubOption";
import './../../styles/tailwind.css'; // Make sure to import Tailwind CSS

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
      <div className="bg-gray-800 text-white rounded-md shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
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
            &#10063;
          </button>
          <button
            title="Delete Option Node"
            className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center"
            onClick={() => onDelete(id)}
          >
            &times;
          </button>
        </div>
        {!isOptionCollapsed && (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Display Text"
                value={options.displayText}
                onChange={(e) =>
                  handleInputChange("displayText", e.target.value)
                }
                onBlur={(e) => handleBlur("displayText", e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
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
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
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
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.message && (
                <small className="text-red-500">{errors.message}</small>
              )}
            </div>
            <div>
              <input
                type="text"
                value={options.feedback}
                placeholder="Feedback"
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                onBlur={(e) => handleBlur("feedback", e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
              />
              {errors.feedback && (
                <small className="text-red-500">{errors.feedback}</small>
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
              />
            ))}
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleAddSubOption}
            >
              &nbsp; + &nbsp;
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
