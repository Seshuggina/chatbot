import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Popup from "reactjs-popup";
import "./OptionsNode.css";
import EditOptionsOnPopUp from "./EditOptions";
import { SubOption, Option } from "./../models/common.models";
// import { validateOptionField } from "./../services/validation";
import { validateOptionField } from "./../services/validateOptions";

const OptionsNode: React.FC<NodeProps> = ({ data, id }) => {
  const optionData = data.options;
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    field: keyof SubOption,
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
    field: keyof SubOption,
    value: string | { to: string; cc: string }
  ) => {
    const newSubOptions = [...options.subOptions];
    if (typeof value === "string") {
      newSubOptions[optionIndex][field] = value as never;
    }
    const newOptions = { ...options, subOptions: newSubOptions };
    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
  };

  const handleAddSubOption = () => {
    const newSubOption = {
      title: "",
      subTitle: "",
      value: "",
      category: "",
      leadEmailTo: "",
      leadEmailCc: "",
      isCollapsed: false,
    };

    const newOptions = {
      ...options,
      subOptions: [...options.subOptions, newSubOption],
    };

    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
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
    setOptions(modifiedOptions);
    data.handleChange(id, modifiedOptions, "options");
  };

  const onDelete = (id: any) => {
    data.onDelete(id);
  };
  const closeModal = () => setOpen(false);

  return (
    <>
      <div className="custom-node">
        <div className="custom-node-header d-flex justify-content-between align-items-center">
          <strong
            className="cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {" "}
            Options
          </strong>
          <button
            className="btnNone"
            title="Expand"
            onClick={() => setOpen((o) => !o)}
          >
            &#10063;
          </button>
          <button
            title="Delete Option Node"
            className="closeButton remove-node"
            onClick={() => onDelete(id)}
          >
            &times;
          </button>
        </div>
        {!isCollapsed && (
          <div className="custom-node-body">
            <div title="Display Text">
              <input
                type="text"
                placeholder="Display Text"
                value={options.displayText}
                onChange={(e) =>
                  handleInputChange("displayText", e.target.value)
                }
                onBlur={(e) => handleBlur("displayText", e.target.value)}
              />
              {errors.displayText && (
                <small className="error">{errors.displayText}</small>
              )}
            </div>
            <div title="Property Name">
              <input
                type="text"
                placeholder="Property Name"
                value={options.propertyName}
                onChange={(e) =>
                  handleInputChange("propertyName", e.target.value)
                }
                onBlur={(e) => handleBlur("propertyName", e.target.value)}
              />
              {errors.propertyName && (
                <small className="error">{errors.propertyName}</small>
              )}
            </div>
            <div title="Message">
              <input
                type="text"
                value={options.message}
                placeholder="Display Text"
                onChange={(e) => handleInputChange("message", e.target.value)}
                onBlur={(e) => handleBlur("message", e.target.value)}
              />
              {errors.message && (
                <small className="error">{errors.message}</small>
              )}
            </div>
            <div title="Feedback">
              <input
                type="text"
                value={options.feedback}
                placeholder="Feedback"
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                onBlur={(e) => handleBlur("feedback", e.target.value)}
              />
              {errors.feedback && (
                <small className="error">{errors.feedback}</small>
              )}
            </div>
            {/* Sub Options */}
            {options.subOptions.map((subOption, index) => (
              <div key={index} className="sub-option-section">
                <div className="sub-option-header">
                  <strong onClick={() => toggleSubOption(index)}>
                    Sub Option {index + 1}
                  </strong>

                  {options.subOptions.length > 1 && (
                    <button
                      title="Delete Options"
                      className="btn-danger"
                      onClick={() => handleDeleteSubOption(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
                {!subOption.isCollapsed && (
                  <div className="sub-option-body">
                    <div title="Title">
                      <input
                        type="text"
                        placeholder="Title"
                        value={subOption.title}
                        onChange={(e) =>
                          handleSubOptionChange(index, "title", e.target.value)
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "title", e.target.value)
                        }
                      />
                      {errors.subOptions && errors.subOptions[index]?.title && (
                        <small className="error">
                          {errors.subOptions[index]?.title}
                        </small>
                      )}
                    </div>
                    <div title="Sub Title">
                      <input
                        type="text"
                        placeholder="Sub Title"
                        value={subOption.subTitle}
                        onChange={(e) =>
                          handleSubOptionChange(
                            index,
                            "subTitle",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "subTitle", e.target.value)
                        }
                      />
                      {errors.subOptions &&
                        errors.subOptions[index]?.subTitle && (
                          <small className="error">
                            {errors.subOptions[index]?.subTitle}
                          </small>
                        )}
                    </div>
                    <div title="Value">
                      <input
                        type="text"
                        placeholder="Value"
                        value={subOption.value}
                        onChange={(e) =>
                          handleSubOptionChange(index, "value", e.target.value)
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "value", e.target.value)
                        }
                      />
                      {errors.subOptions && errors.subOptions[index]?.value && (
                        <small className="error">
                          {errors.subOptions[index]?.value}
                        </small>
                      )}
                    </div>
                    <div title="Category">
                      <select
                        value={subOption.category}
                        onChange={(e) =>
                          handleSubOptionChange(
                            index,
                            "category",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "category", e.target.value)
                        }
                      >
                        <option value="">Select Category</option>
                        <option value="presale">Presale</option>
                        <option value="general">General</option>
                        <option value="others">Others</option>
                      </select>
                      {errors.subOptions &&
                        errors.subOptions[index]?.category && (
                          <small className="error">
                            {errors.subOptions[index]?.category}
                          </small>
                        )}
                    </div>
                    <div title="Lead Email To">
                      <input
                        type="text"
                        placeholder="Lead Email To"
                        value={subOption.leadEmailTo}
                        onChange={(e) =>
                          handleSubOptionChange(
                            index,
                            "leadEmailTo",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(
                            index,
                            "leadEmailTo",
                            e.target.value
                          )
                        }
                      />
                      {errors.subOptions &&
                        errors.subOptions[index]?.leadEmailTo && (
                          <small className="error">
                            {errors.subOptions[index]?.leadEmailTo}
                          </small>
                        )}
                    </div>
                    <div title="Lead Email Cc">
                      <input
                        type="text"
                        placeholder="Lead Email Cc"
                        value={subOption.leadEmailCc}
                        onChange={(e) =>
                          handleSubOptionChange(
                            index,
                            "leadEmailCc",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleSubOptionBlur(
                            index,
                            "leadEmailCc",
                            e.target.value
                          )
                        }
                      />
                      {errors.subOptions &&
                        errors.subOptions[index]?.leadEmailCc && (
                          <small className="error">
                            {errors.subOptions[index]?.leadEmailCc}
                          </small>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="btn btn-sm btn-success"
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

export default OptionsNode;
