import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";

import { ErrorIcon, CheckmarkIcon } from "../Icons/Icons"; // สมมติว่าไฟล์ชื่อ Icons.js

const EmailInput = forwardRef(
  ({ head, label, value, onChange, errorMessage, required }, ref) => {
    const [touched, setTouched] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValid = isValidEmail(value);
    const shouldValidate = required || value !== "";
    const hasError = touched && shouldValidate && !isValid;
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
      validate: () => {
        setTouched(true);
        return isValid;
      },

      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Scroll ให้เห็น (optionally ปรับ HEADER_HEIGHT ตามจริง)
          setTimeout(() => {
            const rect = inputRef.current.getBoundingClientRect();
            const HEADER_HEIGHT = 80;
            window.scrollTo({
              top: window.scrollY + rect.top - HEADER_HEIGHT - 24,
              behavior: "smooth",
            });
          }, 10);
        }
      },
    }));

    return (
      <div
        className={`input-group ${hasError ? "error" : ""} ${
          !hasError && touched && isValid ? "valid" : ""
        }`}
      >
        {head && <div className="group-label">{head}</div>}
        {/* <div className="input-group"> */}
        <div className="input-inner">
          <input
            ref={inputRef}
            type="email"
            className="form-input"
            placeholder=" "
            value={value}
            onChange={(e) => {
              onChange(e.target.value); // ✅ ส่งกลับไปให้ parent
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
          />
          <label className="input-label">
            {label}
            {required && " "}
          </label>
          <span className="validation-icon valid-icon">
            <CheckmarkIcon></CheckmarkIcon>
          </span>
          <span className="validation-icon error-icon">
            <ErrorIcon></ErrorIcon>
          </span>
          {hasError && <div className="text-error-message">{errorMessage}</div>}
        </div>
      </div>
    );
  }
);

export default EmailInput;
