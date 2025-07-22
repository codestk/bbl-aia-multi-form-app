// 📁 src/utils/loadRuntimeConfig.js
export const loadRuntimeConfig = async () => {
  try {
    const res = await fetch("/Assets/FormAIAs/runtime-config.json");
    if (!res.ok) throw new Error("⛔ โหลด runtime config ไม่สำเร็จ");
    const config = await res.json();
    window.__CONFIG__ = config;
  } catch (err) {
    console.error("❌ ไม่สามารถโหลด runtime config:", err);
    window.__CONFIG__ = {}; // fallback
  }
};