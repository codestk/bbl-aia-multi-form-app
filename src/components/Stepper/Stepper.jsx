import React, { useState, Fragment } from "react";
import "../Stepper/stepper.css";

// คอมโพเนนต์ Stepper สำหรับนำทางผ่านขั้นตอนต่างๆ
const Stepper = ({ steps, initialStep = 1 }) => {
  // State สำหรับติดตามขั้นตอนปัจจุบันที่ใช้งานอยู่
  const [currentStep, setCurrentStep] = useState(initialStep);
  // State สำหรับเก็บข้อมูลที่รวบรวมจากแต่ละขั้นตอน
  const [stepsData, setStepsData] = useState({}); // ✅ เพิ่ม

  // ฟังก์ชันสำหรับจัดการการเสร็จสิ้นขั้นตอนและไปยังขั้นตอนถัดไป
  const handleStepCompletionAndAdvance = (formDataFromStep) => {
    console.log(
      `Stepper: Step ${currentStep} completed. Data:`,
      formDataFromStep
    );

    // ✅ เก็บข้อมูลของ step ปัจจุบัน
    setStepsData((prev) => ({
      ...prev,
      [currentStep - 1]: formDataFromStep,
    }));

    // ✅ ไป step ถัดไป
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Stepper: All steps completed!");
    }
  };

  // ฟังก์ชันสำหรับจัดการการคลิกที่ตัวบ่งชี้ขั้นตอน
  const handleStepClick = (stepNumber) => {
    // อนุญาตให้ย้อนกลับไปยังขั้นตอนก่อนหน้าได้
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // รับรายละเอียดของขั้นตอนปัจจุบัน
  const currentStepDetails = steps[currentStep - 1];
  let stepContentToRender;

  // แสดงผลคอมโพเนนต์สำหรับขั้นตอนปัจจุบัน พร้อมส่ง props ที่จำเป็น
  if (currentStepDetails) {
    stepContentToRender = React.cloneElement(currentStepDetails.component, {
      onStepComplete: handleStepCompletionAndAdvance,
      stepsData: stepsData, // ✅ ส่งเข้าไปให้ step
    });
  }

  return (
    <div className="stepper-container">
      {/* แถวของตัวบ่งชี้ขั้นตอน */}
      <div className="stepper-row">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          // ตรวจสอบว่าขั้นตอนเสร็จสมบูรณ์ กำลังใช้งานอยู่ หรือกำลังจะมาถึง
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          // อนุญาตให้คลิกที่ขั้นตอนที่เสร็จสมบูรณ์เพื่อย้อนกลับ
          const canClick = isCompleted;

          // กำหนดคลาส CSS สำหรับตัวบ่งชี้ขั้นตอน
          let indicatorClasses = "stepper-item__indicator";
          if (isCompleted)
            indicatorClasses += " stepper-item__indicator--completed";
          else if (isActive)
            indicatorClasses += " stepper-item__indicator--active";
          else indicatorClasses += " stepper-item__indicator--upcoming";
          if (canClick)
            indicatorClasses += " stepper-item__indicator--clickable";

          // กำหนดคลาส CSS สำหรับป้ายชื่อขั้นตอน
          let labelClasses = "stepper-item__label";
          if (isCompleted || isActive)
            labelClasses += " stepper-item__label--highlighted";
          else labelClasses += " stepper-item__label--dimmed";

          // กำหนดคลาส CSS สำหรับเส้นเชื่อมต่อขั้นตอน
          let lineClasses = "stepper-line";
          if (isCompleted) lineClasses += " stepper-line--completed";

          return (
            <Fragment key={step.name + index}>
              {/* รายการ Stepper แต่ละรายการ */}
              <div className="stepper-item">
                {/* ตัวบ่งชี้ขั้นตอน (ตัวเลขหรือเครื่องหมายถูก) */}
                <div
                  className={indicatorClasses}
                  onClick={() =>
                    canClick ? handleStepClick(stepNumber) : null
                  }
                >
                  {isCompleted ? (
                    // ไอคอนเครื่องหมายถูกสำหรับขั้นตอนที่เสร็จสมบูรณ์
                    <svg
                      className="stepper-item__icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    // หมายเลขขั้นตอนสำหรับขั้นตอนที่กำลังใช้งานอยู่หรือกำลังจะมาถึง
                    <span className="stepper-item__number">{stepNumber}</span>
                  )}
                </div>
                {/* ป้ายชื่อขั้นตอน */}
                <p className={labelClasses}>{step.name}</p>
              </div>
              {/* เส้นเชื่อมต่อขั้นตอน (ไม่แสดงหลังขั้นตอนสุดท้าย) */}
              {stepNumber < steps.length && <div className={lineClasses} />}
            </Fragment>
          );
        })}
      </div>
      {/* คอนเทนเนอร์สำหรับเนื้อหาของขั้นตอนปัจจุบัน */}
      <div className="stepper-content">{stepContentToRender}</div>
    </div>
  );
};

export default Stepper;
