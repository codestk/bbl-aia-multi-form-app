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
import { ButtonPrimary, formatNumber } from "input-states-react";

import { useState, useEffect } from "react";
import { fetchPlanData } from "../../api/planApi";

import { matchPlanByNestedKey } from "../../utils/matchPlanByNestedKey";

function getPlanDisplayName(formData, config) {
  // ✅ แบบ 1: ค่าเดียวตรงๆ
  if (config.planName) return config.planName;

  // ✅ แบบ 2: override ตาม coverage
  const rules = config.planOverrideByCoverage;
  const rawCoverage = formData?.coverage;
  const coverage = Number(String(rawCoverage).replace(/[^\d.]/g, ""));

  if (Array.isArray(rules) && !isNaN(coverage)) {
    const rule = rules.find((r) => {
      const min = r.min ?? -Infinity;
      const max = r.max ?? Infinity;
      return coverage >= min && coverage <= max;
    });

    if (rule?.planName) return rule.planName;
  }

  return null; // ❌ fallback: ไม่เจอ planName
}

const Step3Content = ({ onStepComplete, formData }) => {
  // 1. ดึง template จาก window.__FORM_DATA__ (config)
  const step = window.__FORM_DATA__?.steps[2] || {};
  // 2. เตรียม state สำหรับ planData
  const [planData, setPlanData] = useState(
    window.__FORM_DATA__?.planData || {}
  );
  // 3. ดึง URL API จาก window.__FORM_DATA__ หรือใช้ default
  // const apiUrl = window.__FORM_DATA__?.planDataApiUrl || "";

  // 4. ดึงข้อมูลจาก API เมื่อโหลด component

  const config = window.__FORM_DATA__ || [];

  // Plan name based on coverage
  const planName = getPlanDisplayName(formData, config);

  //------------------------------------------------------------------------

  const prospectCategory = window.__FORM_DATA__.prospectCategory;

  useEffect(() => {
    const scrollTarget = document.querySelector("#content-main"); // <== ให้ Step2 มี id นี้

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  useEffect(() => {
    // const scrollTarget = document.querySelector("#content-main"); // <== ให้ Step2 มี id นี้

    // <== ให้ Step2 มี id นี้

    const fetchAll = async () => {
      const payload = {
        // prospectAge: 32,
        // prospectGender: "M",
        // prospectSA: 100000,

        prospectAge: formData.age,
        prospectGender: formData.gender,
        prospectSA: formData.coverage,
        //==========================================
        prospectCategory: prospectCategory,
      };

      const result = await fetchPlanData(payload);

      //ใช้   Json  Config เลือกแผน จาก  api

      const selectedPlan = matchPlanByNestedKey(
        result.data.plans,
        formData,
        config.planSelector
      );
      console.log(selectedPlan);
      setPlanData(selectedPlan || result.data.plans[0]);

      //-----------------------------------------------------
    };

    const timer = setTimeout(() => {
      fetchAll();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const baseItems = config.steps[2].planFields?.base || [];
  const riderItems = config.steps[2].planFields?.riders || [];
  console.log(riderItems);
  return (
    <div>
      <div>
        <h5 className="mb-1  highlight-title">{planName}</h5>

        <div className="section-mini">
          {[...baseItems, ...riderItems].map((item, i) => {
            const unit = item.unit || "";
            let value = null;

            // 🟦 BASE (จาก planData root)
            if (baseItems.includes(item)) {
              value = planData?.[item.valueKey];
            }

            // 🟪 RIDER (จาก planData.rider)
            if (
              (value === null || value === undefined) &&
              riderItems.includes(item) &&
              Array.isArray(planData.rider)
            ) {
              // ✅ 1. หาแบบ match riderCode → เอา riderSA
              const matchByCode = planData.rider.find(
                (r) => r?.riderCode === item.valueKey
              );
              if (matchByCode && matchByCode.riderSA != null) {
                value = matchByCode.riderSA;
              }

              // ✅ 2. หาแบบ match key field → ดึงตรงๆ (roomAndBoard, dailyComp, etc.)
              if (value === null || value === undefined) {
                const matchByField = planData.rider.find((r) =>
                  Object.prototype.hasOwnProperty.call(r, item.valueKey)
                );
                value = matchByField?.[item.valueKey];
              }
            }

            const displayValue =
              value !== undefined && value !== null ? formatNumber(value) : "-";

            return (
              <div className="plan-summary-item" key={i}>
                <span className="plan-summary-item-label">{item.label}</span>
                <span className="plan-summary-item-value">
                  <span className="value">{displayValue}</span>
                  {unit && <span className="unit"> {unit}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="total-premium mb-3">
          <span className="total-premium-label">
            {step.planFields.premium?.label}
          </span>
          <div>
            <span className="total-premium-value">
              {formatNumber(planData[step.planFields.premium?.valueKey])}
            </span>
            <span className="total-premium-unit">
              {step.planFields.premium?.unit}
            </span>
          </div>
        </div>

        {/* <div className="mb-2 ">
          <p className=" ">{step.planDetailLink?.desc}</p>
          <a
            href={step.planDetailLink?.url}
            className="styled-link"
            target="_blank"
            rel="noopener"
          >
            <span>{step.planDetailLink?.label}</span>
          </a>
        </div>

        <div className="company-info  mb-2">{step.company}</div>
        <div className="footer-note note-text mb-2">{step.notice}</div> */}

 <div className="info-block">
  <div className="info-item">
    <p className="info-text">{step.planDetailLink?.desc}</p>
    <a
      href={step.planDetailLink?.url}
      className="info-link"
      target="_blank"
      rel="noopener"
    >
      {step.planDetailLink?.label}
    </a>
  </div>

  <div className="info-item company-info">{step.company}</div>
  <div className="info-item footer-note">{step.notice}</div>
</div>



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
                ? (window.location.href = step.dropLeadFormUrl) //onStepComplete({ step3Data: "ข้อมูลจาก Step 3 สำเร็จ" })
                : (window.location.href = step.dropLeadFormUrl)
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
