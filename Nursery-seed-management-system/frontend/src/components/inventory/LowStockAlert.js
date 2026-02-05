import React from "react";

const LowStockAlert = ({ quantity }) => {
  if (quantity < 10) {
    return <div style={{color:"red"}}>⚠ Low Stock: {quantity} items left</div>;
  }
  return null;
};

export default LowStockAlert;