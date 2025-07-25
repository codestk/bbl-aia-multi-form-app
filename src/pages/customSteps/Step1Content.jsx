import {FormBuilder} from "input-states-react";
/********************************************************************
 * Step1Content: Form หน้าแรก
 * - รับ props: onStepComplete, formData, setFormData
 * - render BaseForm และส่ง field/formData/setFormData ไปให้
 *******************************************************************/
const Step1Content = ({
  onStepComplete,
  formData,
  setFormData,
  mappedFields,
}) => {
  const buttonLabel = window.__FORM_DATA__.steps[0].buttonLabel;

  return (
    <div className="form-container">
      <FormBuilder
        fields={mappedFields}
        onFormSubmitAndValidated={onStepComplete}
        formData={formData}
        setFormData={setFormData}
        buttonLabel={buttonLabel}
      />
    </div>
  );
};
export default Step1Content;
