import React, { useState, useEffect } from "react";
import "./../styles/bootstrap.css";
import "./OptionsNode.css";

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

  const handleSubInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedSubOptions = [...mainSection.subOptions];
    const subOption = { ...updatedSubOptions[index] };

    if (name.startsWith("leadEmail.")) {
      const emailField = name.split(".")[1] as "to" | "cc";
      subOption.leadEmail[emailField] = value;
    } else {
      (subOption as any)[name] = value;
    }

    updatedSubOptions[index] = subOption;
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
          leadEmail: { to: "", cc: "" },
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
      <div className="modal-header">
        <h5 className="modal-title">Edit Options</h5>
        <button type="button" className="close" title="Close popup" onClick={close}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        {/* <div className="container"> */}
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label>Display Text</label>
              <input
                type="text"
                className="form-control"
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
                className="form-control"
                name="propertyName"
                value={mainSection.propertyName}
                onChange={handleMainInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            className="form-control"
            name="message"
            value={mainSection.message}
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
                  className="close"
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
                        className="form-control"
                        name="title"
                        value={subOption.title}
                        onChange={(e) => handleSubInputChange(index, e)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Sub Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subTitle"
                        value={subOption.subTitle}
                        onChange={(e) => handleSubInputChange(index, e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Value</label>
                      <input
                        type="text"
                        className="form-control"
                        name="value"
                        value={subOption.value}
                        onChange={(e) => handleSubInputChange(index, e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Lead Email To</label>
                      <input
                        type="text"
                        className="form-control"
                        name="leadEmail.to"
                        value={subOption.leadEmail.to}
                        onChange={(e) => handleSubInputChange(index, e)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Lead Email Cc</label>
                      <input
                        type="text"
                        className="form-control"
                        name="leadEmail.cc"
                        value={subOption.leadEmail.cc}
                        onChange={(e) => handleSubInputChange(index, e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-primary" onClick={addSubOption}>
          Add Sub Option
        </button>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close}>
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </>
  );
};

export default EditOptionsOnPopUp;
