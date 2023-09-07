import { PropsWithChildren } from "react";
import "./Toggles.css";

export const ToggleButton = ({
  selected,
  onClick,
  children,
}: PropsWithChildren<{
  selected: boolean;
  onClick: () => void;
}>) => {
  return (
    <button
      className={`Toggle-button ${selected ? "Toggle-button-selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
