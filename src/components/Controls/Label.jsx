// import React from "react";

// function StandardLabel({ children }) {
//   return <div className="text-default  label-standard">{children}</div>;
// }

// export default StandardLabel;

//----------------------------------------------------------------

// import React from "react";

// function StandardLabel({ children, className = "", style = {} }) {
//   return (
//     <div className={`text-default label-standard ${className}`} style={style}>
//       {children}
//     </div>
//   );
// }
// //
// export default StandardLabel;

//ถ้าคุณอยากรองรับ HTML เช่น <b>หมายเหตุ:</b> ให้ใช้
function Label({ html, children, className = "", style = {} }) {
  if (html) {
    return (
      <div
        className={`text-default label-standard ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`text-default label-standard ${className}`} style={style}>
      {children}
    </div>
  );
}

export default Label;
