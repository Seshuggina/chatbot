// src/ValidationMessages.tsx
import React from "react";

// Define the type for the messages object
type ValidationMessagesProps = {
  messages: { [key: string]: string };
};

const ValidationMessages: React.FC<ValidationMessagesProps> = ({
  messages,
}) => {
  return (
    <>
      {Object.entries(messages).map(([key, value]) => (
        <p key={key} className="col-span-full text-red-600">
          <strong>{key}:</strong> {value}
        </p>
      ))}
    </>
  );
};

export default ValidationMessages;
