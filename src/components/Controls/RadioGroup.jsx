import  {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";

const RadioGroup = forwardRef(
  (
    {
      head,
      name,
      options,
      value,
      onChange,
      errorMessage = "กรุณากรอกข้อมูลให้ถูกต้อง",
      direction = "horizontal", // ✅ เพิ่มตรงนี้  vertical
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [hovered, setHovered] = useState(null);
    const containerRef = useRef(null);
    const firstRadioRef = useRef(null);
    useImperativeHandle(ref, () => ({
      validate: () => {
        setTouched(true);
        return !!value;
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
          if (firstRadioRef.current) {
            firstRadioRef.current.focus();
          }
        }, 300);
      },
    }));

    // ถ้ามี error จาก parent และยังไม่เคย touched, ให้แสดง error ทันที
    // useEffect(() => {
    //   if (errorMessage && !touched) {
    //     setTouched(true);
    //   }
    // }, [errorMessage]);

    //const showError = touched && (!value || errorMessage);
    const showError = touched && !value;

    // ✅ Dynamic class จาก direction prop
    const optionsRowClass =
      direction === "vertical"
        ? "radio-options-row-Vertical"
        : "radio-options-row-Horizontal";

    return (
      <div ref={containerRef} className="input-group radio-group-horizontal">
        {head && <div className="group-label">{head}</div>}
        <div className={optionsRowClass}>
          {options.map((opt, index) => {
            const isSelected = value === opt.value;
            const isHovered = hovered === opt.value;

            return (
              <label
                key={opt.value}
                className="radio-option"
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
              >
                <input
                  ref={index === 0 ? firstRadioRef : null}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={onChange}
                />
                <span className="custom-radio-customForm">
                  {isSelected ? (
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#0064FF"
                        strokeWidth="2"
                      />
                      <path
                        d="M7 12L10 15L16 8"
                        stroke="#0064FF"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : isHovered ? (
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#0064FF"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#ccc"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </span>
                <span className="radio-text">{opt.label}</span>
              </label>
            );
          })}
        </div>
        {showError && (
          <div className="text-error-message">
            {errorMessage || "กรุณาเลือกเพศ"}
          </div>
        )}
      </div>
    );
  }
);

export default RadioGroup;
