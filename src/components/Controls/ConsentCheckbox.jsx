import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {  CheckmarkIcon } from "../Icons/Icons"; // สมมติว่าไฟล์ชื่อ Icons.js
const ConsentCheckbox = forwardRef(
  (
    {
      height = 200,
      checked,
      onChange,
      children,
      errorMessage = "กรุณากรอกข้อมูลให้ถูกต้อง",
      requireFullScroll = true,
      scrollThreshold = 0.95,
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [showScrollError, setShowScrollError] = useState(false);
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Create ref for the checkbox input and container
    const checkboxRef = useRef(null);
    const containerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      validate: () => {
        setTouched(true);
        return checked === true;
      },
      focus: () => {
        // Scroll to container first
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        // Then focus the checkbox
        setTimeout(() => {
          if (checkboxRef.current) {
            checkboxRef.current.focus();
          }
        }, 300);
      },
    }));

    const scrollRef = useRef(null);
    const [canCheck, setCanCheck] = useState(false);

    useEffect(() => {
      const box = scrollRef.current;
    const handleScroll = () => {
    const reachedBottom =
      box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
    if (reachedBottom) {
      setCanCheck(true);
      setShowScrollError(false);
      setHasScrolledToEnd(true); // ✅ เพื่อให้แสดง check icon ทันที
    }
  };

      if (box.scrollHeight <= box.clientHeight) {
        setCanCheck(true);
      }

    if (box) {
    // ✅ ถ้า scroll ไม่จำเป็น (เนื้อหาสั้นกว่ากล่อง) → อนุญาตให้ติ๊กได้เลย
    const contentFits = box.scrollHeight <= box.clientHeight;
    if (contentFits) {
      setCanCheck(true);
      setHasScrolledToEnd(true);
    }

    box.addEventListener("scroll", handleScroll);
    return () => box.removeEventListener("scroll", handleScroll);
  }
    }, []);

    const handleTryCheck = () => {
      if (!canCheck) setShowScrollError(true);
    };

    const handleScroll = (e) => {
      const element = e.target;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;

      // คำนวณ progress (0-1)
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(Math.min(progress, 1));

      // ตรวจสอบว่าเลื่อนครบตาม threshold หรือยัง
      if (progress >= scrollThreshold) {
        setHasScrolledToEnd(true);
      }
    };

    // const handleCheckboxChange = (e) => {
    //   setIsChecked(e.target.checked);
    //   setTouched(true);
    // };

    return (
      <div className="input-group consent-scroll-box" ref={containerRef}>
        <label className="consent-container" onClick={handleTryCheck}>
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            disabled={!canCheck}
            onChange={(e) => {
              if (canCheck) {
                onChange(e.target.checked);
                setShowScrollError(false);
              }
              setTouched(true);
            }}
          />

          <span className="custom-checkbox">
            {checked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="4"
                  stroke="#007BFF"
                  strokeWidth="2"
                />
                <path d="M7 12L10 15L17 8" stroke="#007BFF" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="4"
                  stroke="#ccc"
                  strokeWidth="2"
                />
              </svg>
            )}
          </span>

          {/* <div ref={scrollRef} className="consent-scroll-box">
            {children}
          </div> */}

          <div className="scroll-container" style={{ position: "relative" ,width: '100%' }}>
            <div
              ref={scrollRef}
              className={`scroll-content ${showScrollError ? "error" : ""}`}
              style={{
                height,
                border: `1px solid ${
                  showScrollError ? "var(--font-color-error-pws)" : "#ddd"
                }`,
              }}
              onScroll={handleScroll}
              tabIndex={0}
            >
              {/* {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: children }} />
            ) : (
              children  

            
            )} */}
              {/* {children} */}
                 <div dangerouslySetInnerHTML={{ __html: children }} />
            </div>

            {/* Scroll Progress Indicator */}
            {requireFullScroll && (
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  backgroundColor: hasScrolledToEnd ? "" : "#007bff",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {hasScrolledToEnd ? (
                  <CheckmarkIcon></CheckmarkIcon>
                ) : (
                  `${Math.round(scrollProgress * 100)}%`
                )}
              </div>
            )}
          </div>
        </label>

        {showScrollError ? (
          <div className="text-error-message">
            ※ กรุณาเลื่อนอ่านข้อมูลให้ครบก่อนติ๊กยินยอม
          </div>
        ) : touched && !checked ? (
          <div className="text-error-message">
            {errorMessage || "※ กรุณายินยอมก่อนดำเนินการต่อ"}
          </div>
        ) : null}
      </div>
    );
  }
);

export default ConsentCheckbox;
