/**
 * Step3Content: Step สรุปแผนประกัน
 *
 * 🔹 แสดงรายละเอียดของแผนประกัน (ชื่อแผน รายละเอียดผลประโยชน์ รายปี ความคุ้มครอง)
 * 🔹 ใช้ข้อมูลจาก `window.__FORM_DATA__` และสามารถโหลดเพิ่มเติมจาก API ภายนอก
 * 🔹 รองรับการกำหนดค่าหัวข้อ รายการผลประโยชน์ ปุ่ม และลิงก์จาก config
 * 🔹 ใช้ useEffect เพื่อ fetch API และแสดงข้อมูลล่าสุด
 *
 * Props:
 * - onStepComplete: ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้คลิกปุ่มดำเนินการต่อ
 */
import {ButtonPrimary} from "input-states-react";
import { formatNumber } from "input-states-react";
import { useState, useEffect } from "react";
const Step3Content = ({ onStepComplete }) => {
  // 1. ดึง template จาก window.__FORM_DATA__ (config)
  const step = window.__FORM_DATA__?.steps[2] || {};
  // 2. เตรียม state สำหรับ planData
  const [planData, setPlanData] = useState(
    window.__FORM_DATA__?.planData || {}
  );
  // 3. ดึง URL API จาก window.__FORM_DATA__ หรือใช้ default
  const apiUrl = window.__FORM_DATA__?.planDataApiUrl || "";

  // 4. ดึงข้อมูลจาก API เมื่อโหลด component
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setPlanData(data))
      .catch(() => {}); // fallback ให้ใช้ข้อมูลใน window.__FORM_DATA__ อยู่แล้ว
  }, [apiUrl]);

  return (
    <div>
      <div>
        <p className="mb-1" style={{ fontWeight: "bold" }}>
          {step.planTitle || "แผนของคุณ"}
        </p>
        <p style={{ fontWeight: "bold", color: "#0064FF" }}>
          {step.planSubtitle || ""}
        </p>

        <div className="section-mini">
          {step.items?.map((item, i) => (
            <div className="item" key={i}>
              <span className="item-label">{item.label}</span>
              <span className="item-value">
                {formatNumber(planData[item.valueKey])}
                {item.unit ? ` ${item.unit}` : ""}
              </span>
            </div>
          ))}
        </div>

        <div className="total-premium">
          <span className="total-premium-label">{step.premium?.label}</span>
          <div>
            <span className="total-premium-value">
              {formatNumber(planData[step.premium?.valueKey])}
            </span>
            <span className="total-premium-unit">{step.premium?.unit}</span>
          </div>
        </div>

        <div className="section-mini">
          <p className="mb-3">{step.planDetailLink?.desc}</p>
          <a
            href={step.planDetailLink?.url}
            className="styled-link"
            target="_blank"
            rel="noopener"
          >
            <span>{step.planDetailLink?.label}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ verticalAlign: "middle", marginLeft: 6 }}
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="#1565c0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="company-info section-mini">{step.company}</div>
        <div className="footer-note">{step.notice}</div>

        <div
          className="submit-container"
          // onClick={() =>
          //   onStepComplete
          //     ? onStepComplete({ step3Data: "ข้อมูลจาก Step 3 สำเร็จ" })
          //     : alert("Step 3 เสร็จสิ้น")
          // }
        >
          <ButtonPrimary
            type="submit"
            className="btn-primary"
            // onClick={() => (window.location.href = step.dropLeadFormUrl)}
            onClick={() =>
              onStepComplete
                ? onStepComplete({ step3Data: "ข้อมูลจาก Step 3 สำเร็จ" })
                :  (window.location.href = step.dropLeadFormUrl)
            }
          >
            {step.buttonLabel}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default Step3Content;
