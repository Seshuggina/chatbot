import React, { useState, useEffect } from "react";
import "./../styles/bootstrap.css";
import "./OptionsNode.css";
import { Option, SubOption } from "./../models/common.models";
import { validateOptionField } from "./../services/validateOptions";

interface EditOptionsOnPopUpProps {
  optionsData: Option;
  save: (options: Option) => void;
  close: () => void;
}

const EditOptionsOnPopUp: React.FC<EditOptionsOnPopUpProps> = ({
  optionsData,
  save,
  close,
}) => {
  const [mainSection, setMainSection] = useState<Option>(optionsData);
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    setMainSection(optionsData);
  }, [optionsData]);

  const handleMainInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMainSection({
      ...mainSection,
      [name]: value,
    });
  };

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

  const handleSubInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedSubOptions = [...mainSection.subOptions];
    const subOption = { ...updatedSubOptions[index] };

    (subOption as any)[name] = value;

    updatedSubOptions[index] = subOption;
    setMainSection({
      ...mainSection,
      subOptions: updatedSubOptions,
    });
  };

  const handleSelectChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    const updatedSubOptions = [...mainSection.subOptions];
    updatedSubOptions[index].category = value;
    setMainSection({
      ...mainSection,
      subOptions: updatedSubOptions,
    });
  };

  const handleSubOptionToggle = (index: number) => {
    const updatedSubOptions = mainSection.subOptions.map((subOption, i) =>
      i === index
        ? { ...subOption, isCollapsed: !subOption.isCollapsed }
        : subOption
    );
    setMainSection({
      ...mainSection,
      subOptions: updatedSubOptions,
    });
  };

  const addSubOption = () => {
    setMainSection({
      ...mainSection,
      subOptions: [
        ...mainSection.subOptions,
        {
          title: "",
          subTitle: "",
          value: "",
          category: "",
          leadEmailTo: "",
          leadEmailCc: "",
        },
      ],
    });
  };

  const deleteSubOption = (index: number) => {
    setMainSection({
      ...mainSection,
      subOptions: mainSection.subOptions.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    save(mainSection);
    close();
  };

  return (
    <>
      <div className="modal-header py-2">
        <h5 className="modal-title">Edit Options</h5>
        <button
          type="button"
          className="close"
          title="Close popup"
          onClick={close}
        >
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label>Display Text</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="displayText"
                value={mainSection.displayText}
                onChange={handleMainInputChange}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>Property Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="propertyName"
                value={mainSection.propertyName}
                onChange={handleMainInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Message</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="message"
            value={mainSection.message}
            onChange={handleMainInputChange}
          />
        </div>
        <div className="form-group">
          <label>FeedBack</label>
          <textarea
            className="form-control form-control-sm"
            name="feedback"
            value={mainSection.feedback}
            onChange={handleMainInputChange}
          />
        </div>
        {mainSection.subOptions.map((subOption, index) => (
          <div key={index} className="sub-option-section">
            <div className="sub-option-header">
              <span onClick={() => handleSubOptionToggle(index)}>
                {subOption.title || `Sub Option ${index + 1}`}
              </span>
              {mainSection.subOptions.length > 1 && (
                <button
                  type="button"
                  className="close btn btn-sm btn-danger"
                  onClick={() => deleteSubOption(index)}
                >
                  &times;
                </button>
              )}
            </div>
            {!subOption.isCollapsed && (
              <div className="container mb-3">
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="title"
                        value={subOption.title}
                        onChange={(e) => handleSubInputChange(index, e)}
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
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Sub Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="subTitle"
                        value={subOption.subTitle}
                        onChange={(e) => handleSubInputChange(index, e)}
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Value</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="value"
                        value={subOption.value}
                        onChange={(e) => handleSubInputChange(index, e)}
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
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Select Category</label>
                      <select
                        className="form-control form-control-sm"
                        value={subOption.category}
                        onChange={(e) => handleSelectChange(index, e)}
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Lead Email To</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="leadEmailTo"
                        value={subOption.leadEmailTo}
                        onChange={(e) => handleSubInputChange(index, e)}
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
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Lead Email Cc</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="leadEmailCc"
                        value={subOption.leadEmailCc}
                        onChange={(e) => handleSubInputChange(index, e)}
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
                </div>
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-primary btn-sm" onClick={addSubOption}>
          Add Sub Option
        </button>
      </div>
      <div className="modal-footer py-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={close}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
    </>
  );
};

export default EditOptionsOnPopUp;
