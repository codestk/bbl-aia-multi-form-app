// export const updateFieldState = (field, setFormData, setErrors) => (valueOrEvent) => {
//   const value = valueOrEvent?.target?.value ?? valueOrEvent;

  
//   setFormData((prev) => ({ ...prev, [field]: value }));
//   setErrors((prev) => {
//     const { [field]: _, ...rest } = prev;
//     return rest;
//   });
// };

// ✅ แบบ default export ฟังก์ชันเดียว
const updateFieldState = (field, setFormData, setErrors) => (valueOrEvent) => {
  const value = valueOrEvent?.target?.value ?? valueOrEvent;

  setFormData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => {
    const { [field]: _, ...rest } = prev;
    return rest;
  });
};

export default updateFieldState;
