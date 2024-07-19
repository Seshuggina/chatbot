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

    case "feedback":
      if (!value) return "Feedback is required";
      if (value.length < 3) return "Feedback must be at least 3 characters";
      if (value.length > 50) return "Feedback must be at most 50 characters";
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

export const validateFiles = (files: File[], fileType: string): boolean => {
  if (!files || files.length === 0) return false;
  const fileExtension:any = {
    PDF: "pdf",
    Images: ["jpg", "jpeg", "png", "gif"],
    Video: ["mp4", "avi", "mov"],
  };
  const extensions = fileExtension[fileType];
  return files.every((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    return Array.isArray(extensions)
      ? extensions.includes(ext || "")
      : ext === extensions;
  });
};
