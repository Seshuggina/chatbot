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

    if (!subOption.leadEmail.to || !isValidEmail(subOption.leadEmail.to)) {
      newErrors[`leadEmailTo_${index}`] = "Lead Email To must be a valid email";
    }

    if (subOption.leadEmail.cc && !isValidEmail(subOption.leadEmail.cc)) {
      newErrors[`leadEmailCc_${index}`] = "Lead Email CC must be a valid email";
    }
  });

  return newErrors;
};

export const validateFiles = (files: File[], fileType: string): boolean => {
  const allowedTypes = {
    PDF: "application/pdf",
    Images: ["image/jpeg", "image/png", "image/gif"],
    Video: "video/mp4",
  };

  return files.every((file) => {
    if (fileType === "PDF") {
      return file.type === allowedTypes.PDF;
    } else if (fileType === "Images") {
      return allowedTypes.Images.includes(file.type);
    } else if (fileType === "Video") {
      return file.type === allowedTypes.Video;
    }
    return false;
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
  return !!urlPattern.test(url);
};
