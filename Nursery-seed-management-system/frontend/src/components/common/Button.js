import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * Button Component
 * ----------------
 * Props:
 * - children: Button text or JSX
 * - onClick: click handler
 * - type: button, submit, reset
 * - variant: "primary" | "success" | "alert" (default: "primary")
 * - disabled: boolean
 * - icon: optional JSX icon
 */

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  icon = null,
}) => {
  const btnClass = classNames("btn", {
    [`btn-${variant}`]: variant,
    "btn-disabled": disabled,
  });

  return (
    <button type={type} className={btnClass} onClick={onClick} disabled={disabled}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "success", "alert"]),
  disabled: PropTypes.bool,
  icon: PropTypes.element,
};

export default Button;
