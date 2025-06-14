import { useState, useRef } from "react";
import {
  validateFields,
  updateFieldState,
  useFormErrors,
} from "../Forms/helpers";

import ButtonPrimary from "../Controls/ButtonPrimary";

/**
 * BaseForm - ฟอร์ม React สำหรับ dynamic fields
 * - รับ fields เป็น array เพื่อ render input แต่ละชนิด
 * - ทำ validation & error handling
 * - รองรับทั้ง input, custom component, label, และ consent checkbox
 */
const BaseForm = ({
  onFormSubmitAndValidated, // Callback เมื่อฟอร์มผ่าน validation และ submit สำเร็จ
  fields, // Array ของ config field ทั้งหมด
  formData, // State object ของข้อมูลในฟอร์มแต่ละช่อง
  setFormData, // Setter สำหรับเปลี่ยนค่า formData
  buttonLabel,
}) => {
  // ใช้ custom hook สำหรับ error state (เก็บ error message แยก field)
  const { errors, setErrors } = useFormErrors();

  // สถานะปุ่ม submit (กันกดซ้ำ/loading)
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * refs - เก็บ ref ของแต่ละ input (ยกเว้น label/info field)
   * เพื่อให้สามารถ focus ไป field แรกที่ error ได้
   */
  const refs = Object.fromEntries(
    fields
      .filter((f) => f.type !== "label" && f.name) // filter เฉพาะ input จริง
      .map((f) => [f.name, useRef()])
  );

  /**
   * handleSubmit - ฟังก์ชันหลักของฟอร์มเมื่อผู้ใช้ submit
   * - prevent reload หน้า
   * - validate ทุก field ที่ต้อง validate
   * - ถ้ามี error: set error state + focus field แรก
   * - ถ้าไม่มี error: เรียก onFormSubmitAndValidated (ถ้ามี)
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน form reload page
    setIsSubmitting(true); // set loading state

    // --- Validate ทุก field (input จริง) ---
    const newErrors = validateFields(
      refs,
      Object.fromEntries(
        fields
          .filter((f) => !f.type || f.type !== "label")
          .map((f) => [f.name, f.errorMessage])
      )
    );
    setErrors(newErrors);

    // ถ้ามี error - focus ไป field แรกที่ error แล้ว return
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstErrorRef = refs[firstErrorField];
      if (
        firstErrorRef &&
        firstErrorRef.current &&
        typeof firstErrorRef.current.focus === "function"
      ) {
        firstErrorRef.current.focus();
      }
      setIsSubmitting(false);
      return;
    }

    // ถ้าไม่มี error - submit ข้อมูล
    try {
      // simulate async request (จริงควรเปลี่ยนเป็น API call)
      await new Promise((r) => setTimeout(r, 3000));
      if (onFormSubmitAndValidated) {
        onFormSubmitAndValidated(formData);
      }
    } catch (e) {
      // error ระหว่างส่งข้อมูล
      console.error(e);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }

    setIsSubmitting(false); // reset loading state
  };

  // ---------- Rendering ส่วน Form ----------
  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => {
        // skip field ที่ไม่ควร render (เช่น ไม่มี component)
        if (!field.component) return null;

        // render label/info/custom component (ไม่มี value/onChange/validate)
        if (field.type === "custom") {
          const CustomComponent = field.component;
          return <CustomComponent key={index} {...field.props} />;
        }

        const Component = field.component;
        const ref = refs[field.name];

        // ConsentCheckbox: checked/onChange
        if (field.name === "consent") {
          return (
            <Component
              key={index}
              ref={ref}
              {...field.props}
              checked={!!formData[field.name]}
              onChange={updateFieldState(
                field.name,
                setFormData,
                () => {},
                field.errorMessage
              )}
              errorMessage={field.errorMessage}
            />
          );
        }

        // input field ปกติ
        return (
          <Component
            key={index}
            ref={ref}
            {...field.props}
            value={formData[field.name]}
            onChange={updateFieldState(
              field.name,
              setFormData,
              () => {},
              field.errorMessage
            )}
            errorMessage={field.errorMessage}
          />
        );
      })}

      {/* ปุ่ม Submit */}
      <div className="submit-container">
 
          <ButtonPrimary
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? buttonLabel :buttonLabel}
          </ButtonPrimary>
   
      </div>
    </form>
  );
};

export default BaseForm;
