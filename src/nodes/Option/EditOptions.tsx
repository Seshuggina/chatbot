import React, { useState, useEffect } from "react";
import { Option, SubOption } from "./../../models/common.models";
import { validateOptionField } from "./../../services/validation";

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
          id: "",
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
    <div className="flow-node fixed inset-0 flex flex-col bg-gray-900 text-white">
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-10">
        <div className="modal-header p-4 flex justify-between items-center">
          <h5 className="modal-title text-lg font-bold">Edit Options</h5>
          <button
            type="button"
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            title="Close popup"
            onClick={close}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="min-w-[200px] px-2 shadow-md">
            <div className="form-group mb-1">
              <label className="input-label">Display Text</label>
              <input
                type="text"
                className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
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
          <div className="min-w-[200px] px-2 shadow-md">
            <div className="form-group mb-1">
              <label className="input-label">Property Name</label>
              <input
                type="text"
                className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
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
          <div className="min-w-[200px] px-2 shadow-md">
            <div className="form-group mb-1">
              <label className="input-label">Message</label>
              <input
                type="text"
                className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
                name="message"
                value={mainSection.message}
                onChange={handleMainInputChange}
                onBlur={(e) => handleBlur("message", e.target.value)}
              />
              {errors.message && (
                <small className="text-red-500">{errors.message}</small>
              )}
            </div>
          </div>
          <div className="min-w-[200px] px-2 shadow-md">
            <div className="form-group mb-1">
              <label className="input-label">Fall back</label>
              <textarea
                className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-700 text-white rounded"
                name="fallback"
                value={mainSection.fallback}
                onChange={handleMainInputChange}
                onBlur={(e) => handleBlur("fallback", e.target.value)}
              />
              {errors.fallback && (
                <small className="text-red-500">{errors.fallback}</small>
              )}
            </div>
          </div>
        </div>
        {mainSection.subOptions.map((subOption, index) => (
          <div key={index} className="accordion mb-2">
            <div
              className={`accordion-header flex items-center p-1 cursor-pointer border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition-colors`}
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
              {mainSection.subOptions.length > 1 && (
                <button
                  type="button"
                  className="text-white bg-red-500 hover:bg-red-700 rounded-full h-6 w-6 flex items-center justify-center ml-4"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from bubbling up to the header
                    deleteSubOption(index);
                  }}
                >
                  &times;
                </button>
              )}
            </div>
            {!subOption.isCollapsed && (
              <div className="accordion-content bg-gray-700 p-4 rounded">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <div className="min-w-[200px]">
                    <div className="form-group">
                      <label className="input-label">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
                  <div className="min-w-[200px]">
                    <div className="form-group">
                      <label className="input-label">Sub Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
                  <div className="min-w-[200px">
                    <div className="form-group">
                      <label className="input-label">Value</label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
                  <div className="min-w-[200px]">
                    <div className="form-group">
                      <label className="input-label">
                        Select Category
                      </label>
                      <select
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
                  <div className="min-w-[200px]">
                    <div className="form-group">
                      <label className="input-label">
                        Lead Email To
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
                  <div className="min-w-[200px]">
                    <div className="form-group">
                      <label className="input-label">
                        Lead Email Cc
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm w-full p-1 border border-gray-600 bg-gray-800 text-white rounded"
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
          className="flex px-2 py-1 font-semibold text-white btn-primary-custom rounded items-center"
          onClick={addSubOption}
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
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-md">
        <div className="modal-footer py-2 px-4 flex justify-between">
          <button
            type="button"
            className="flex items-center justify-center rounded btn px-2 py-2 btn-secondary bg-gray-600 hover:bg-gray-700"
            onClick={close}
          >
            <svg
              className="w-6 h-6 text-white cursor-pointer hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            Close
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 font-semibold text-white btn-primary-custom rounded "
            onClick={handleSave}
          >
            <svg
              className="w-6 h-6 text-white cursor-pointer hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2zM7 3v4a1 1 0 001 1h8a1 1 0 001-1V3M7 10h10v11H7V10z"
              ></path>
            </svg>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOptionsOnPopUp;
