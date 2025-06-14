import React from "react";

// ปุ่ม primary แบบ reuse ได้
const ButtonPrimary = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn-primary  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;