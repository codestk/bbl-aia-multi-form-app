import { useState, useEffect } from "react";
import Page from "./pages/Page";
import "./App.css";

// import 'input-states-react/dist/fonts/BBLSans-Regular.woff';

import "input-states-react/dist/input-states-react.css";

 

const App = () => {
  const [formData, setformData] = useState(""); // default หน้า 1



  useEffect(() => {
 

    const formData = window.__FORM_DATA__;
    if (formData) {
      setformData[formData];
    }
  }, []);

  const renderPage = () => {
    // switch (page) {
    //   case "1":
    //     return <Page1 data={formData} />;
    //   case "3":
    //     return <Page3 data={formData} />;
    //   default:
    //     return <div>ไม่พบหน้าที่ต้องการ</div>;
    // }
    // return <Page data={formData} />;
    return <Page data={formData} />;
   // return <DemoForm />;
  };


  return <div>{renderPage()}</div>;
};

export default App;
