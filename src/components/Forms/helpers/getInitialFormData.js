export default function getInitialFormData(fields) {
  const result = {};
  fields.forEach((field) => {
    // เฉพาะ field ที่ไม่มี type หรือ type เป็น input/text เท่านั้น (exclude custom/label)
    if ((!field.type || field.type === "input") && field.name) {
      if (field.name === "consent") {
        result[field.name] = false;
      } else {
        result[field.name] = field.props?.defaultValue ?? "";
      }
    }
  });
  return result;
}