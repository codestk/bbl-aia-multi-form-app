// Icons.js
import React from 'react';

export const ErrorIcon = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="#FF0000"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M12 17V11"
        stroke="#FF0000"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M11.9998 7.5C12.4415 7.5 12.7995 7.85807 12.7996 8.2998C12.7996 8.74163 12.4416 9.09961 11.9998 9.09961C11.558 9.0995 11.2 8.74157 11.2 8.2998C11.2001 7.85813 11.5581 7.50011 11.9998 7.5Z"
        fill="#FF0000"
        stroke="#FF0000"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const CheckmarkIcon = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 12.6924L8.245 19L22 5"
        stroke="#2DCD73"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
};
 
// คุณสามารถเพิ่ม default export ได้หากต้องการ หรือจะ export named exports แบบนี้ก็ได้
// export default { ErrorIcon, CheckmarkIcon }; // อีกทางเลือกหนึ่งในการ export