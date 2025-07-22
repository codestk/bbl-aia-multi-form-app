// utils/matchPlanByNestedKey.js

export function matchPlanByNestedKey(plans, formData, selector) {
 

  if (!plans || !Array.isArray(plans) || !selector || !formData) return null;

  const { type, matchKey, targetKey } = selector;
  const matchValue = formData?.[matchKey];
  if (!matchValue && type !== "rangeByCoverage") return null;

  // ✅ แบบ 1: matchToroomAndBoard (แบบ nested)
  if (type === "matchToroomAndBoard" && targetKey) {
    const targetPath = targetKey.split("."); // eg. ['rider', '0', 'roomAndBoard']

    for (const plan of plans) {
      let current = plan;
      let valid = true;
      for (const key of targetPath) {
        if (current && Object.prototype.hasOwnProperty.call(current, key)) {
          current = current[key];
        } else {
          valid = false;
          break;
        }
      }
      if (valid && current == matchValue) {
        return plan;
      }
    }
  }

  // ✅ แบบ 2: matchKeyToPlanCode (root level)
  if (type === "matchKeyToPlanCode") {
    return plans.find((plan) => plan[targetKey] == matchValue);
  }

  // ✅ แบบ 3: rangeByCoverage (เช็คช่วงจาก rules)
  // ✅ 3: rangeByCoverage (เช็คช่วง coverage → map ไปยัง planCode)
  if (type === "rangeByCoverage" && Array.isArray(selector.rules)) {
    const rawCoverage = formData?.[matchKey];
    const coverage = Number(rawCoverage); // ✅ แปลงให้แน่ใจว่าเป็น number

    if (isNaN(coverage)) return null; // 🛑 กรองค่าผิดพลาด

    const matchedRule = selector.rules.find((rule) => {
      const min = rule.min ?? -Infinity;
      const max = rule.max ?? Infinity;
      return coverage >= min && coverage <= max;
    });

    if (matchedRule && matchedRule.planCode && targetKey) {
      return plans.find((plan) => plan[targetKey] == matchedRule.planCode);
    }
  }

  // ❌ ไม่เจอ plan ที่ตรงเงื่อนไข
  return null;
}
