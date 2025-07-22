

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { loadRuntimeConfig } from "./utils/loadRuntimeConfig";

const bootstrap = async () => {
  await loadRuntimeConfig(); // ✅ รอโหลด runtime config ก่อน
  const root = createRoot(document.getElementById("root"));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap(); // ✅ เรียกฟังก์ชันเริ่มต้น




// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
