import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";
import { ErrorIcon, CheckmarkIcon } from "../Icons/Icons"; // สมมติว่าไฟล์ชื่อ Icons.js
const TextInput = forwardRef(
  (
    {
      head,
      label,
      value,
      onChange,
      errorMessage = "กรุณากรอกข้อมูลให้ถูกต้อง",
      required,
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const inputRef = useRef(null);

    // regex: อนุญาตแค่ a-z A-Z ก-ฮ สระ วรรณยุกต์ไทย และ space (ไม่เอา ; หรือ symbol อื่นๆ)
    const regex = /^[a-zA-Z\u0E00-\u0E7F\s]+$/;
    const isValidText = (text) => {
      const val = text || "";
      return !required || (val.trim() !== "" && regex.test(val));
    };
    const isValid = isValidText(value);
    const shouldValidate = required || value !== "";
    const hasError = touched && shouldValidate && !isValid;

    // กรองทุก symbol ที่ไม่ใช่ไทย/eng/space ออก (รวม ; ด้วย)
    const handleChange = (e) => {
      let v = e.target.value;
      v = v.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, "");
      onChange(v);
      setTouched(true);
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        setTouched(true);
        return isValid;
      },
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Scroll ให้เห็น input ด้วย (แก้ HEADER_HEIGHT ถ้ามี header)
          setTimeout(() => {
            const rect = inputRef.current.getBoundingClientRect();
            const HEADER_HEIGHT = 80; // ปรับตาม header จริง
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
        <div className="input-inner">
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            placeholder=" "
            value={value || ""}
            onChange={handleChange}
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

export default TextInput;
