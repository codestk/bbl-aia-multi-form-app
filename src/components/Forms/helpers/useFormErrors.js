// 📁 src/utils/useFormErrors.js
import { useState } from "react";

export    default function  useFormErrors  ()  {
  const [errors, setErrors] = useState({});
  const clearFieldError = (field) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };
  return { errors, setErrors, clearFieldError };
};