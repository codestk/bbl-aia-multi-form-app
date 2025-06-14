/********************************************************************
 * Step2Content: Step ถัดไป (แสดงข้อมูลแผนประกัน)
 * - รับ onStepComplete และ stepsData (ข้อมูลจากขั้นก่อนหน้า)
 * - แสดงข้อมูลตัวอย่างและปุ่มไปต่อ
 *******************************************************************/

import ButtonPrimary from "../../components/Controls/ButtonPrimary";
import Label from "../../components/Controls/Label";

const Step2Content = ({ onStepComplete, stepsData }) => {
  // รับข้อมูลจาก Step 1
  // const dataFromStep1 = stepsData && stepsData[0];
  //const buttonLabel = window.__FORM_DATA__.steps[1].buttonLabel;

  const { buttonLabel, warning, insurancePlanHtml } =
    window.__FORM_DATA__.steps[1];
  return (
    <div className=" ">
      <div dangerouslySetInnerHTML={{ __html: insurancePlanHtml }} />
      <div
        className="submit-container"
        onClick={() =>
          onStepComplete
            ? onStepComplete({ step2Data: "ข้อมูลจาก Step 2 สำเร็จ" })
            : alert("Step 2 เสร็จสิ้น")
        }
      >
        <ButtonPrimary type="submit">{buttonLabel}</ButtonPrimary>
      </div>
      <Label>{warning}</Label>
    </div>
  );
};
export default Step2Content;
