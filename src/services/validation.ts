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

  const isValidUrl = filesData.url && isValidURLStrict(filesData.url);
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

  if (!mapData.url || !isValidURLStrict(mapData.url)) {
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
