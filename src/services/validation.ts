export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOptions = (options: any): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (
    !options.displayText ||
    options.displayText.length < 3 ||
    options.displayText.length > 50
  ) {
    newErrors.displayText = "Display Text must be between 3 and 50 characters";
  }

  if (
    !options.propertyName ||
    options.propertyName.length < 3 ||
    options.propertyName.length > 50
  ) {
    newErrors.propertyName =
      "Property Name must be between 3 and 50 characters";
  }

  if (
    !options.message ||
    options.message.length < 3 ||
    options.message.length > 500
  ) {
    newErrors.message = "Message must be between 3 and 500 characters";
  }

  options.subOptions.forEach((subOption: any, index: number) => {
    if (
      !subOption.title ||
      subOption.title.length < 3 ||
      subOption.title.length > 50
    ) {
      newErrors[`title_${index}`] = "Title must be between 3 and 50 characters";
    }

    if (
      !subOption.subTitle ||
      subOption.subTitle.length < 3 ||
      subOption.subTitle.length > 50
    ) {
      newErrors[`subTitle_${index}`] =
        "Sub Title must be between 3 and 50 characters";
    }

    if (
      !subOption.value ||
      subOption.value.length < 3 ||
      subOption.value.length > 500
    ) {
      newErrors[`value_${index}`] =
        "Value must be between 3 and 500 characters";
    }

    if (!subOption.leadEmailTo || !isValidEmail(subOption.leadEmailTo)) {
      newErrors[`leadEmailTo_${index}`] = "Lead Email To must be a valid email";
    }

    if (subOption.leadEmailCc && !isValidEmail(subOption.leadEmailCc)) {
      newErrors[`leadEmailCc_${index}`] = "Lead Email CC must be a valid email";
    }
  });

  return newErrors;
};

export const validateFileNode = (filesData: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (
    !filesData.message ||
    filesData.message.length < 3 ||
    filesData.message.length > 500
  ) {
    errors.message = "Message must be between 3 and 500 characters";
  }

  const isValidUrl = filesData.url && isValidURL(filesData.url);
  const hasValidFiles =
    filesData.files && validateFiles(filesData.files, filesData.fileType);

  if (!isValidUrl && !hasValidFiles) {
    errors.fileOrUrl = "Either a valid URL or valid files must be provided";
  }

  if (hasValidFiles && !filesData.fileType) {
    errors.fileType = "File type is required";
  }

  return errors;
};

export const validateMapNode = (mapData: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (
    !mapData.message ||
    mapData.message.length < 3 ||
    mapData.message.length > 500
  ) {
    errors.message = "Message must be between 3 and 500 characters";
  }

  if (!mapData.url || !isValidURL(mapData.url)) {
    errors.url = "URL must be valid";
  }

  return errors;
};

export const validateFiles = (files: File[], fileType: string): boolean => {
  if (!files || files.length === 0) return false;

  const fileExtension: Record<string, string | string[]> = {
    pdf: "pdf",
    images: ["jpg", "jpeg", "png", "gif"],
    video: ["mp4", "avi", "mov"],
  };

  const extensions = fileExtension[fileType];
  return files.every((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    return Array.isArray(extensions)
      ? extensions.includes(ext || "")
      : ext === extensions;
  });
};

export const isValidURL = (url: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  return urlPattern.test(url);
};

// Additional stricter URL validation function
export const isValidURLStrict = (url: string) => {
  const strictPattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  return strictPattern.test(url);
};


export const validateOptionField = (field: string, value: string): string => {
  switch (field) {
    case "displayText":
      if (!value) return "Display Text is required";
      if (value.length < 3) return "Display Text must be at least 3 characters";
      if (value.length > 50)
        return "Display Text must be at most 50 characters";
      break;
    case "propertyName":
      if (!value) return "Property Name is required";
      if (value.length < 3)
        return "Property Name must be at least 3 characters";
      if (value.length > 50)
        return "Property Name must be at most 50 characters";
      break;
    case "message":
      if (!value) return "Message is required";
      if (value.length < 3) return "Message must be at least 3 characters";
      if (value.length > 500) return "Message must be at most 500 characters";
      break;

    case "fallback":
      if (!value) return "Fall back is required";
      if (value.length < 3) return "Fall Back must be at least 3 characters";
      if (value.length > 50) return "Fall back must be at most 50 characters";
      break;

    case "title":
      if (!value) return "Title is required";
      if (value.length < 3) return "Title must be at least 3 characters";
      if (value.length > 50) return "Title must be at most 50 characters";
      break;
    case "subTitle":
      if (!value) return "Sub Title is required";
      if (value.length < 3) return "Sub Title must be at least 3 characters";
      if (value.length > 50) return "Sub Title must be at most 50 characters";
      break;
    case "value":
      if (!value) return "Value is required";
      if (value.length < 3) return "Value must be at least 3 characters";
      if (value.length > 500) return "Value must be at most 500 characters";
      break;
    case "category":
      if (!value) return "Value is required";
      break;
    case "leadEmailTo":
      if (!value) return "Lead Email To is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Lead Email To is invalid";
      break;
    case "leadEmailCc":
      if (value && !/\S+@\S+\.\S+/.test(value))
        return "Lead Email CC is invalid";
      break;
    default:
      break;
  }
  return "";
};

export const validateFileNodeField = (field: any, value: string): string => {
  switch (field) {
    case "message":
      if (!value) return "Message is required";
      if (value.length < 3) return "Message must be at least 3 characters";
      if (value.length > 500) return "Message must be at most 500 characters";
      break;
    case "fileType":
      if (!value) return "File Type is required";
      break;
    case "files":
      if (!value || value.length === 0)
        return "At least one file must be uploaded";
      break;
    case "url":
      if (!value) return "URL is required if no files are uploaded";
      break;
    default:
      return "";
  }
  return "";
};