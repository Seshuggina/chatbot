import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Popup from "reactjs-popup";
import "./OptionsNode.css";
import EditOptionsOnPopUp from "./EditOptions";

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
  // Popup
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  // End of popup

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [options, setOptions] = useState<Option>({
    displayText: "",
    propertyName: "",
    message: "",
    subOptions: [
      {
        title: "",
        subTitle: "",
        value: "",
        leadEmail: {
          to: "",
          cc: "",
        },
        isCollapsed: false,
      },
    ],
  });

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
    if (field === "leadEmail" && typeof value !== "string") {
      newSubOptions[optionIndex][field] = value as { to: string; cc: string };
    } else if (typeof value === "string") {
      newSubOptions[optionIndex][field] = value as never; // TypeScript workaround
    }
    setOptions({
      ...options,
      subOptions: newSubOptions,
    });
    const newOptions = { ...options, subOptions: newSubOptions };
    data.handleChange(id, newOptions, "options");
  };

  const handleAddSubOption = () => {
    const newSubOption = {
      title: "",
      subTitle: "",
      value: "",
      id: Math.random().toString(36).substring(2, 9),
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

  const togglePopup = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setOpen(true);
  };

  const closeModel = () => {
    
  };

  const savedPopupData = (modifiedOptions: SubOption) => {
    console.log("popUpEditedData", modifiedOptions);
  };

  return (
    <>
      <div className="custom-node">
        <div
          className="custom-node-header d-flex justify-content-between"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          Options
          <button title="expand" onClick={() => setOpen((o) => !o)}>
            &#10063;
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
                <div
                  className="sub-option-header"
                  onClick={() => toggleSubOption(index)}
                >
                  {subOption.title || "Add Options"}
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
                    {options.subOptions.length > 1 && (
                      <button onClick={() => handleDeleteSubOption(index)}>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button onClick={handleAddSubOption}>Add</button>
            {/* <button onClick={handleSave}>Save</button> */}
          </div>
        )}
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
      {/* {open && ( */}
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <EditOptionsOnPopUp
          save={savedPopupData}
          optionsData={options}
          close={closeModal}
        />
      </Popup>
      {/* )} */}
    </>
  );
};

export default OptionsNode;
