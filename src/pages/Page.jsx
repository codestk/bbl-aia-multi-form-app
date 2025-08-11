/**
 * Page: Main Component ของหน้า (stepper + ฟอร์ม)
 * - สร้าง state formData สำหรับเก็บข้อมูลที่กรอก
 * - สร้าง stepsConfig: กำหนดขั้นตอนแต่ละ step (stepper)
 * - ส่ง stepsConfig ให้ Stepper ใช้งาน
 */

import { useState, useEffect } from "react";

import { Stepper } from "input-states-react";

import { getInitialFormData, mapFieldComponents } from "input-states-react";

// CSS สำหรับตกแต่ง -------------------------------------------------------------------
//import "input-states-react/components/Controls/formControls.css";
//import "input-states-react/styles/utilities.css";

import { Step1Content, Step2Content, Step3Content } from "./customSteps";

// รับฟิลด์ฟอร์มจาก global window (ปกติจะมาจาก backend หรือไฟล์ config)
const rawFields = window.__FORM_DATA__?.fieds || [];
// mapFieldComponents: เปลี่ยน string เป็น component ที่นำมาใช้จริง
const mappedFields = mapFieldComponents(rawFields);

// const buttonLabel = window.__FORM_DATA__.steps[0].buttonLabel;

const Page = () => {
  // สร้าง state เก็บข้อมูลแต่ละฟิลด์ (ค่าเริ่มต้นมาจาก fields)
  const [formData, setFormData] = useState(getInitialFormData(mappedFields));

  //  console.log(formData);

  const stepNames = window.__FORM_DATA__?.steps?.map((s) => s.name) || [];
  // กำหนดขั้นตอนใน stepper (แต่ละ step คือ 1 หน้า)
  const stepsConfig = (formData, setFormData) => [
    {
      name: stepNames[0],
      component: (
        <Step1Content
          formData={formData}
          setFormData={setFormData}
          mappedFields={mappedFields}
        />
      ),
    },
    { name: stepNames[1], component: <Step2Content /> },
    { name: stepNames[2], component: <Step3Content formData={formData} /> },
  ];

  // render stepper + เนื้อหา
  return (
    <div id="stepper-container" className="stepper-wrapper">
      <Stepper steps={stepsConfig(formData, setFormData)} initialStep={1} />
    </div>
  );
};

export default Page;
