import React from "react";

export default function BarBtn({
  label,
  groundColor,
  icon,
  onPress,
}: BarBtnProps) {
  return (
    <button className="tooltip" onClick={(e) => onPress(e)}>
      <div className="icon-container" style={{ backgroundColor: groundColor }}>
        {icon}
      </div>
      <span className="tooltiptext">{label}</span>
    </button>
  );
}

interface BarBtnProps {
  label: String;
  groundColor: any;
  icon: any;
  onPress(e: any): void;
}
