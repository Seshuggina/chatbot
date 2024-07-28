import React, { useEffect, useState } from "react";
import { getDrafts, getVersions } from "./../services/FlowStorage";

interface DropdownOption {
  key: string;
  label: string;
}

const FlowDropdown = (props: any) => {
  const [draftOptions, setDraftOptions] = useState<DropdownOption[]>([]);
  const [versionOptions, setVersionOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const drafts = getDrafts();
    const versions = getVersions();

    const draftOpts = drafts.map((_, index) => ({
      key: `draft${index + 1}`,
      label: `Draft ${index + 1}`,
    }));

    const versionOpts = versions.map((_, index) => ({
      key: `version${index + 1}`,
      label: `Version ${index + 1}`,
    }));

    setDraftOptions(draftOpts);
    setVersionOptions(versionOpts);
  }, []);

  const draftChange = (val: any) => {
    console.log("valval draftChange", val);
  };

  const versionChange = (val: any) => {
    console.log("valval versionChange", val);
  };

  return (
    <>
      <div className="mr-2">
        <label htmlFor="drafts text-start">Drafts:</label>
        <select
          id="drafts"
          className="form-select"
          aria-label="Select Draft to View and Modify"
          onChange={(e) => draftChange(e.target.value)}
        >
          <option key="null" value=""></option>
          {draftOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="ms-2">
        <label htmlFor="versions">Versions:</label>
        <select
          id="versions"
          className="form-select"
          aria-label="Select Version to Deploy"
          onChange={(e) => versionChange(e.target.value)}
        >
          <option key="null" value=""></option>
          {versionOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="ms-3 d-flex align-items-end">
        <button className="btn btn-primary">Deploy</button>
      </div>
    </>
  );
};

export default FlowDropdown;
