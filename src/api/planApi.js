// 📁 src/api/planApi.js

// 🔐 เรียก token จาก backend (MVC .NET API)
export const getAccessToken = async () => {
  try {
    // const response = await fetch("/FormAIAs/PlanApi/get-token", {
    //   method: "GET",
    // });

    // console.log(__RequestVerificationToken);
    const response = await fetch("/FormAIAs/FormAIAsPws/GetAccessToken", {
      method: "POST",
      headers: {
        RequestVerificationToken: __RequestVerificationToken, // ✅ ต้องอยู่ใน headers
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("❌ Failed to get token:", response.status);
      return null;
    }

    const token = await response.text();
    return token;
  } catch (error) {
    console.error("❌ Token fetch error:", error);
    return null;
  }
};

// 📦 ใช้ token ไปเรียก backend เพื่อดึงข้อมูลแผนประกัน
export const fetchPlanData = async (payload) => {
  // console.log(payload);

  try {
    const __RequestVerificationToken = document.querySelector(
      'input[name="__RequestVerificationToken"]'
    )?.value;

    const response = await fetch("/FormAIAs/FormAIAsPws/FetchPlanData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        RequestVerificationToken: __RequestVerificationToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("❌ Plan data fetch failed:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Plan fetch error:", error);
    return null;
  }
};
