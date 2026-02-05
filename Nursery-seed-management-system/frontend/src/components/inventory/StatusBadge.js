import React from "react";

const StatusBadge = ({ status }) => {
  const colors = {
    "Ready for Sale": "green",
    "Under Treatment": "orange",
    "Out of Stock": "red"
  };
  return (
    <span style={{color: colors[status] || "gray"}}>
      {status}
    </span>
  );
};

export default StatusBadge;