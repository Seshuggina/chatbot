import React, { useState, useEffect } from "react";
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
  optionsData.subOptions.forEach((subOption) => {
    subOption.isCollapsed = false;
  });

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
    mainSection.subOptions.forEach((subOption) => {
      subOption.isCollapsed = true;
    });
    save(mainSection);
    close();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-10">
        <div className="modal-header p-4">
          <h5 className="modal-title text-lg font-bold">Edit Options</h5>
          <button
            type="button"
            className="text-white float-right"
            title="Close popup"
            onClick={close}
          >
            <span>&times;</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-16 pb-20">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="form-group mb-2">
              <label className="block text-gray-400">Display Text</label>
              <input
                type="text"
                className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
                name="displayText"
                value={mainSection.displayText}
                onChange={handleMainInputChange}
                onBlur={(e) => handleBlur("displayText", e.target.value)}
              />
              {errors.displayText && (
                <small className="text-red-500">{errors.displayText}</small>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="form-group mb-2">
              <label className="block text-gray-400">Property Name</label>
              <input
                type="text"
                className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
                name="propertyName"
                value={mainSection.propertyName}
                onChange={handleMainInputChange}
                onBlur={(e) => handleBlur("propertyName", e.target.value)}
              />
              {errors.propertyName && (
                <small className="text-red-500">{errors.propertyName}</small>
              )}
            </div>
          </div>
        </div>

        <div className="form-group mb-2">
          <label className="block text-gray-400">Message</label>
          <input
            type="text"
            className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            name="message"
            value={mainSection.message}
            onChange={handleMainInputChange}
            onBlur={(e) => handleBlur("message", e.target.value)}
          />
          {errors.message && (
            <small className="text-red-500">{errors.message}</small>
          )}
        </div>
        <div className="form-group mb-2">
          <label className="block text-gray-400">Feedback</label>
          <textarea
            className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            name="feedback"
            value={mainSection.feedback}
            onChange={handleMainInputChange}
            onBlur={(e) => handleBlur("feedback", e.target.value)}
          />
          {errors.feedback && (
            <small className="text-red-500">{errors.feedback}</small>
          )}
        </div>

        {mainSection.subOptions.map((subOption, index) => (
          <div key={index} className="accordion mb-4">
            <div
              className={`accordion-header flex items-center p-2 cursor-pointer border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition-colors`}
              onClick={() => handleSubOptionToggle(index)}
            >
              <span className="mr-3">
                {subOption.isCollapsed ? (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
              </span>
              <span className="flex-1">
                {subOption.title || `Sub Option ${index + 1}`}
              </span>
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center ml-4"
                onClick={() => deleteSubOption(index)}
              >
                &times;
              </button>
            </div>
            {!subOption.isCollapsed && (
              <div className="accordion-content bg-gray-700 p-4 rounded">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
                        name="title"
                        value={subOption.title}
                        onChange={(e) => handleSubInputChange(index, e)}
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "title", e.target.value)
                        }
                      />
                      {errors.subOptions?.[index]?.title && (
                        <small className="text-red-500">
                          {errors.subOptions[index]?.title}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">Sub Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
                        name="subTitle"
                        value={subOption.subTitle}
                        onChange={(e) => handleSubInputChange(index, e)}
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "subTitle", e.target.value)
                        }
                      />
                      {errors.subOptions?.[index]?.subTitle && (
                        <small className="text-red-500">
                          {errors.subOptions[index]?.subTitle}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">Value</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
                        name="value"
                        value={subOption.value}
                        onChange={(e) => handleSubInputChange(index, e)}
                        onBlur={(e) =>
                          handleSubOptionBlur(index, "value", e.target.value)
                        }
                      />
                      {errors.subOptions?.[index]?.value && (
                        <small className="text-red-500">
                          {errors.subOptions[index]?.value}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">
                        Select Category
                      </label>
                      <select
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
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
                      {errors.subOptions?.[index]?.category && (
                        <small className="text-red-500">
                          {errors.subOptions[index]?.category}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">
                        Lead Email To
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
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
                      {errors.subOptions?.[index]?.leadEmailTo && (
                        <small className="text-red-500">
                          {errors.subOptions[index]?.leadEmailTo}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="form-group mb-2">
                      <label className="block text-gray-400">
                        Lead Email Cc
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
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
                      {errors.subOptions?.[index]?.leadEmailCc && (
                        <small className="text-red-500">
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
        <button
          className="btn btn-primary btn-sm bg-blue-600 text-white hover:bg-blue-700 mt-4"
          onClick={addSubOption}
        >
          Add Sub Option
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-md">
        <div className="modal-footer py-2 px-4 flex justify-between">
          <button
            type="button"
            className="btn btn-secondary btn-sm bg-gray-600 hover:bg-gray-700"
            onClick={close}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOptionsOnPopUp;
