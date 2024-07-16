import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Popup from "reactjs-popup";
import "./OptionsNode.css";
import EditOptionsOnPopUp from "./EditOptions";
import { validateOptions } from "./../services/validation";

interface SubOption {
  title: string;
  subTitle: string;
  value: string;
  leadEmail: {
    to: string;
    cc: string;
  };
  isCollapsed?: boolean;
}

interface Option {
  displayText: string;
  propertyName: string;
  message: string;
  subOptions: SubOption[];
}

const OptionsNode: React.FC<NodeProps> = ({ data, id }) => {
  const optionsInput = data.options;
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Option>(optionsInput);

  const closeModal = () => setOpen(false);

  const handleInputChange = (field: keyof Option, value: string) => {
    const newOptions = { ...options, [field]: value };
    const newErrors = validateOptions(newOptions);
    console.log("newErrors", newErrors);
    
    setErrors(newErrors);
    setOptions(newOptions);
    data.handleChange(id, newOptions, "options");
  };

  const handleSubOptionChange = (
    optionIndex: number,
    field: keyof SubOption,
    value: string | { to: string; cc: string }
  ) => {
    const newSubOptions = [...options.subOptions];
    if (field === "leadEmail" && typeof value !== "string") {
      newSubOptions[optionIndex][field] = value as { to: string; cc: string };
    } else if (typeof value === "string") {
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
      leadEmail: {
        to: "",
        cc: "",
      },
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
          <button title="Expand" onClick={() => setOpen((o) => !o)}>
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
            <div>
              <label>Display Text</label>
              <input
                type="text"
                value={options.displayText}
                onChange={(e) =>
                  handleInputChange("displayText", e.target.value)
                }
                placeholder="Display Text"
              />
            </div>
            <div>
              <label>Property Name</label>
              <input
                type="text"
                value={options.propertyName}
                onChange={(e) =>
                  handleInputChange("propertyName", e.target.value)
                }
                placeholder="Property Name"
              />
            </div>
            <div>
              <label>Message</label>
              <input
                type="text"
                value={options.message}
                placeholder="Display Text"
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
            </div>
            {options.subOptions.map((subOption, index) => (
              <div key={index} className="sub-option-section">
                <div className="sub-option-header">
                  <strong onClick={() => toggleSubOption(index)}>
                    {subOption.title || "Add Options"}
                  </strong>

                  {options.subOptions.length > 1 && (
                    <button onClick={() => handleDeleteSubOption(index)}>
                      Delete
                    </button>
                  )}
                </div>
                {!subOption.isCollapsed && (
                  <div className="sub-option-body">
                    <div>
                      <label>Title</label>
                      <input
                        type="text"
                        value={subOption.title}
                        onChange={(e) =>
                          handleSubOptionChange(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label>Sub Title</label>
                      <input
                        type="text"
                        value={subOption.subTitle}
                        onChange={(e) =>
                          handleSubOptionChange(
                            index,
                            "subTitle",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label>Value</label>
                      <input
                        type="text"
                        value={subOption.value}
                        onChange={(e) =>
                          handleSubOptionChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label>Lead Email To</label>
                      <input
                        type="text"
                        value={subOption.leadEmail.to}
                        onChange={(e) =>
                          handleSubOptionChange(index, "leadEmail", {
                            ...subOption.leadEmail,
                            to: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Lead Email Cc</label>
                      <input
                        type="text"
                        value={subOption.leadEmail.cc}
                        onChange={(e) =>
                          handleSubOptionChange(index, "leadEmail", {
                            ...subOption.leadEmail,
                            cc: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={handleAddSubOption}>Add</button>
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
