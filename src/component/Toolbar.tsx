import React from "react";

interface ToolbarProps {
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onDragStart }) => (
  <div className="">
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "message")}
      draggable
    >
      Message
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "options")}
      draggable
    >
      Options
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "leadForm")}
      draggable
    >
      Lead Form
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "leadFlow")}
      draggable
    >
      Lead Flow
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "gptHandler")}
      draggable
    >
      GPT Handler
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "file")}
      draggable
    >
      File
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "map")}
      draggable
    >
      Maps
    </button>
    <button
      className="button"
      onDragStart={(event) => onDragStart(event, "stop")}
      draggable
    >
      Stop
    </button>
  </div>
);

export default Toolbar;
