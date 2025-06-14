// ดึง component ต่าง ๆ ที่ใช้ในฟอร์มจาก Controls folder
import {
  RadioGroup,
  NumericTextInput,
  EmailInput,
  ConsentCheckbox,
  TextInput,
  StandardLabel,
} from "../../Controls";

// 1. สร้าง object สำหรับ map ชื่อ component string → ตัว component จริงที่ import มา
const componentMap = {
  RadioGroup,
  NumericTextInput,
  EmailInput,
  ConsentCheckbox,
  TextInput,
  StandardLabel,
};

// ฟังก์ชันหลัก: รับ array ของ field แล้ว map ให้แต่ละ field มี component ที่ถูกต้อง
export default function mapFieldComponents(fields) {
  return (fields || []).map((field) => {
    // ดึงชื่อ component จาก field.component (เช่น "RadioGroup", "ConsentCheckbox", ฯลฯ)
    // รองรับการ trim() เพื่อกันกรณีพิมพ์มีช่องว่างโดยไม่ได้ตั้งใจ
    const key =
      typeof field.component === "string"
        ? field.component.trim()
        : field.component;

    // คืน object field เดิม + แก้ไข property `component`
    // ถ้าเป็น string จะใช้ componentMap เพื่อแปลงเป็น component function
    return {
      ...field,
      component: typeof key === "string" ? componentMap[key] : key,
    };
  });
}
