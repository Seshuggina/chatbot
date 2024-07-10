import React, { useState } from "react";

import Popup from "reactjs-popup";
import "./../styles/bootstrap.css";
import "./OptionsNode.css";

// Interfaces
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

const EditOptionsOnPopUp = (props: any) => {
  const { optionsData, savedPopupData, closeModal } = props;
  console.log("props", props);

  // End of popup

  const [mainSection, setMainSection] = useState<Option>({
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
      },
    ],
  });

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

  const addSubSection = () => {
    setMainSection({
      ...mainSection,
      subOptions: [
        ...mainSection.subOptions,
        {
          title: "",
          subTitle: "",
          value: "",
          leadEmail: {
            to: "",
            cc: "",
          },
        },
      ],
    });
  };

  const removeSubSection = (index: number) => {
    if (mainSection.subOptions.length > 1) {
      const updatedSubOptions = mainSection.subOptions.filter(
        (_, i) => i !== index
      );
      setMainSection({
        ...mainSection,
        subOptions: updatedSubOptions,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Main Section:", mainSection);
  };

  const saveOptions = () => {
    savedPopupData();
  };

  return (
    <section className="flow-edit-pop">
      <div className="d-flex justify-content-between popup-header">
        <h4 className="">Option </h4>
        <div>
          <button className="btn" onClick={closeModal}>
            &times;
          </button>
        </div>
      </div>

      <div className="optionsEditPopUpContainer">
        <form className="container mb-4" onSubmit={handleSubmit}>
          <div id="main-section">
            <div className="form-group">
              <label htmlFor="displayText">Display Text</label>
              <input
                type="text"
                className="form-control"
                id="displayText"
                name="displayText"
                value={mainSection.displayText}
                onChange={handleMainInputChange}
                placeholder="Enter display text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="propertyName">Property Name</label>
              <input
                type="text"
                className="form-control"
                id="propertyName"
                name="propertyName"
                value={mainSection.propertyName}
                onChange={handleMainInputChange}
                placeholder="Enter property name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                value={mainSection.message}
                onChange={handleMainInputChange}
                placeholder="Enter message"
              />
            </div>
          </div>

          <h5 className="mt-3">Sub Sections</h5>
          <div id="sub-sections">
            {mainSection.subOptions.map((subOption, index) => (
              <>
                <h6 className="mt-2">Sub Section {index + 1}</h6>
                <div className="sub-section" key={index}>
                  <div className="row mb-2">
                    <div className="col-6">
                      <div className="form-group">
                        {/* <label htmlFor={`title${index}`}>Title</label> */}
                        <input
                          type="text"
                          className="form-control"
                          id={`title${index}`}
                          name="title"
                          value={subOption.title}
                          onChange={(e) => handleSubInputChange(index, e)}
                          placeholder="Enter title"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        {/* <label htmlFor={`subTitle${index}`}>Sub Title</label> */}
                        <input
                          type="text"
                          className="form-control"
                          id={`subTitle${index}`}
                          name="subTitle"
                          value={subOption.subTitle}
                          onChange={(e) => handleSubInputChange(index, e)}
                          placeholder="Enter sub title"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-12">
                      <div className="form-group">
                        {/* <label htmlFor={`value${index}`}>Value</label> */}
                        <input
                          type="text"
                          className="form-control"
                          id={`value${index}`}
                          name="value"
                          value={subOption.value}
                          onChange={(e) => handleSubInputChange(index, e)}
                          placeholder="Enter value"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        {/* <label htmlFor={`leadEmail.to${index}`}>
                        Lead Email To
                      </label> */}
                        <input
                          type="text"
                          className="form-control"
                          id={`leadEmail.to${index}`}
                          name="leadEmail.to"
                          value={subOption.leadEmail.to}
                          onChange={(e) => handleSubInputChange(index, e)}
                          placeholder="Enter lead email to"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        {/* <label htmlFor={`leadEmail.cc${index}`}>
                        Lead Email CC
                      </label> */}
                        <input
                          type="text"
                          className="form-control"
                          id={`leadEmail.cc${index}`}
                          name="leadEmail.cc"
                          value={subOption.leadEmail.cc}
                          onChange={(e) => handleSubInputChange(index, e)}
                          placeholder="Enter lead email cc"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        disabled={mainSection.subOptions.length === 1}
                        type="button"
                        className="btn btn-danger remove-btn btn-sm"
                        onClick={() => removeSubSection(index)}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={addSubSection}
                      >
                        Add Sub Section
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </form>
      </div>
      <div className="save-fixed-bottom d-flex justify-content-between">
        <button onClick={saveOptions} type="submit" className="btn btn-success">
          Save
        </button>
      </div>
    </section>
  );
};

export default EditOptionsOnPopUp;
