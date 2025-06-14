// export default function validateFields(refs, errorMap) {
//   const errors = {};
//   Object.keys(refs).forEach((field) => {
//     if (!refs[field].current?.validate()) {
//       errors[field] = errorMap[field];
//     }
//   });
//   return errors;
// }


// ฟังก์ชัน validateFields ตรวจสอบว่าแต่ละฟิลด์ในฟอร์ม valid หรือไม่
export default function validateFields(refs, errorMap) {
  // สร้าง object ว่างไว้เก็บ error ของแต่ละฟิลด์
  const errors = {};

  // วนลูปชื่อฟิลด์ทั้งหมดที่อยู่ใน refs
  Object.keys(refs).forEach((field) => {
    // ถ้า validate() ของฟิลด์นั้น ๆ คืนค่า false หรือ undefined
    if (!refs[field].current?.validate()) {
      // ใส่ error message ของฟิลด์นั้นลงใน errors object
      errors[field] = errorMap[field];
    }
  });

  // ส่งคืน object ที่เก็บ error ทั้งหมด (ถ้าไม่มี error จะเป็น object ว่าง)
  return errors;
}

 