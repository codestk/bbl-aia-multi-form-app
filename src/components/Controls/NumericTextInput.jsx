import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef, // Import useRef
  useLayoutEffect,
} from "react";

// More robust formatNumber: handles partial inputs and ensures correct decimal display
const formatNumber = (value, decimalPlaces = 0) => {
  const numStr = (value ?? "").toString().replace(/,/g, ""); // Clean existing commas

  // Handle empty or non-numeric strings gracefully
  if (numStr === "") return "";

  // Handle case where user is typing a decimal point
  if (numStr.endsWith(".") && decimalPlaces > 0) {
    const intPart = numStr.slice(0, -1);
    if (intPart === "" && numStr === ".") return "0."; // User typed only "."
    const numIntPart = parseFloat(intPart);
    if (!isNaN(numIntPart)) {
      return (
        numIntPart.toLocaleString(undefined, {
          minimumFractionDigits: 0, // Format integer part only
          maximumFractionDigits: 0,
        }) + "."
      );
    }
    return numStr; // If intPart is not a number yet, return as is (e.g. "-.")
  }

  const num = parseFloat(numStr);
  if (isNaN(num)) {
    // If it's not a number but wasn't just an empty string or a trailing dot case
    return numStr; // Return the original non-numeric string (e.g. if it's just "-")
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

// Helper to get a clean numeric string (digits and one decimal point)
const getNumericString = (viewValue, currentDecimalPlaces) => {
  let numericOnlyString = "";
  let hasDecimal = false;
  if (typeof viewValue !== "string") viewValue = (viewValue ?? "").toString();

  for (let i = 0; i < viewValue.length; i++) {
    const char = viewValue[i];
    if (/\d/.test(char)) {
      numericOnlyString += char;
    } else if (char === "." && !hasDecimal && currentDecimalPlaces > 0) {
      numericOnlyString += ".";
      hasDecimal = true;
    } else if (char === "-" && i === 0 && numericOnlyString === "") {
      // Allow leading minus
      numericOnlyString += "-";
    }
  }
  // Handle cases like "." -> "0." or "-." -> "-0."
  if (numericOnlyString === "." && currentDecimalPlaces > 0) return "0.";
  if (numericOnlyString === "-." && currentDecimalPlaces > 0) return "-0.";
  if (
    numericOnlyString.startsWith(".") &&
    currentDecimalPlaces > 0 &&
    numericOnlyString.length > 1
  ) {
    return "0" + numericOnlyString;
  }
  if (
    numericOnlyString.startsWith("-.") &&
    currentDecimalPlaces > 0 &&
    numericOnlyString.length > 2
  ) {
    return "-0" + numericOnlyString.substring(1);
  }
  return numericOnlyString;
};

const NumericTextInput = forwardRef(
  (
    {
      head = "หัวข้อ",
      label = "Label",
      suggest = "",
      value, // Expects a raw number or numeric string (unformatted)
      onChange,
      min = -Infinity,
      max = Infinity,
      errorMessage = "กรุณากรอกข้อมูลให้ถูกต้อง",
      required = false,
      maxDigit = null, // Max digits for the integer part
      decimalPlaces = 0,
    },
    ref
  ) => {
    // rawInput holds the string displayed in the input field (can be comma-formatted)
    const [rawInput, setRawInput] = useState("");
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    // Stores value and cursor position *before* formatting in handleChange
    const previousCursorData = useRef({ value: "", cursor: 0 });

    // Effect to synchronize with external `value` prop
    useEffect(() => {
      const stringValue =
        value === null || value === undefined ? "" : value.toString();
      const cleanPropValue = getNumericString(stringValue, decimalPlaces);

      if (!focused) {
        // If not focused, display the formatted version of the prop value
        setRawInput(formatNumber(cleanPropValue, decimalPlaces));
      } else {
        // If focused, and the underlying numeric prop value changes,
        // update rawInput to the de-formatted new prop value.
        const deFormattedRawInput = getNumericString(rawInput, decimalPlaces);
        if (cleanPropValue !== deFormattedRawInput) {
          setRawInput(cleanPropValue); // Set de-formatted value for editing
          // For cursor management, assume cursor goes to end of new prop value if changed while focused
          if (inputRef.current) {
            previousCursorData.current = {
              value: cleanPropValue,
              cursor: cleanPropValue.length,
            };
          }
        }
      }
    }, [value, focused, decimalPlaces]); // `rawInput` is intentionally not a dependency

    // Validation logic
    const numericValueForValidation = parseFloat(
      getNumericString(rawInput, decimalPlaces)
    );
    const currentCleanString = getNumericString(rawInput, decimalPlaces);

    const isValid =
      (!required && currentCleanString === "") ||
      (currentCleanString === "-" && !required) || // Allow just "-" if not required
      (!isNaN(numericValueForValidation) &&
        numericValueForValidation >= min &&
        numericValueForValidation <= max);

    useImperativeHandle(ref, () => ({
      validate: () => {
        setTouched(true);
        // Re-check validity based on the clean numeric string
        const cleanNumStr = getNumericString(rawInput, decimalPlaces);
        if (!required && cleanNumStr === "") return true;
        if (cleanNumStr === "-" && !required) return true;

        const numToValidate = parseFloat(cleanNumStr);
        return (
          !isNaN(numToValidate) && numToValidate >= min && numToValidate <= max
        );
      },

      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Scroll ให้ชิดบน (ถ้ามี fixed header, ปรับ offset ได้)
          setTimeout(() => {
            const rect = inputRef.current.getBoundingClientRect();
            const HEADER_HEIGHT = 100; // แก้ตามจริงถ้ามี fixed header
            window.scrollTo({
              top: window.scrollY + rect.top - HEADER_HEIGHT - 24,
              behavior: "smooth",
            });
          }, 10);
        }
      },
    }));

    const showError = touched && !isValid && !!errorMessage;

    // Handle focus: remove commas for easier editing
    const handleFocus = () => {
      setFocused(true);
      // `rawInput` might be formatted from blur or prop change, or be user's current typing.
      // Convert current `rawInput` to its clean numeric string form for editing.
      const valueToEdit = getNumericString(rawInput, decimalPlaces);
      setRawInput(valueToEdit);
      if (inputRef.current) {
        // Store current de-formatted value and cursor for useLayoutEffect
        // The selection will be set at the end of this de-formatted value.
        previousCursorData.current = {
          value: valueToEdit,
          cursor: valueToEdit.length,
        };
      }
    };

    // Handle input change: apply live formatting and constraints
    const handleChange = (e) => {
      const viewValue = e.target.value; // Current value from input field
      const selectionStart = e.target.selectionStart;

      // Store for cursor management BEFORE any modification
      previousCursorData.current = { value: viewValue, cursor: selectionStart };

      // 1. Create a clean numeric string (digits, one decimal, optional leading minus)
      let cleanNumericString = "";
      let hasDecimal = false;
      let hasMinus = false;

      for (let i = 0; i < viewValue.length; i++) {
        const char = viewValue[i];
        if (/\d/.test(char)) {
          cleanNumericString += char;
        } else if (char === "." && !hasDecimal && decimalPlaces > 0) {
          cleanNumericString += char;
          hasDecimal = true;
        } else if (char === "-" && i === 0 && !hasMinus) {
          cleanNumericString += char;
          hasMinus = true;
        }
        // Ignore other characters (like extra commas typed by user, or letters)
      }

      // Handle specific cases like "." -> "0." or "-." -> "-0."
      if (cleanNumericString === "." && decimalPlaces > 0)
        cleanNumericString = "0.";
      if (cleanNumericString === "-." && decimalPlaces > 0)
        cleanNumericString = "-0.";

      // 2. Split into integer and decimal parts (handle negative numbers)
      let sign = "";
      let numberPart = cleanNumericString;
      if (cleanNumericString.startsWith("-")) {
        sign = "-";
        numberPart = cleanNumericString.substring(1);
      }

      let [integerPart, decimalPart] = numberPart.split(".");
      integerPart = integerPart || "";

      // 3. Apply constraints (maxDigit for integer, decimalPlaces for decimal)
      if (maxDigit && integerPart.length > maxDigit) {
        integerPart = integerPart.slice(0, maxDigit);
      }
      if (decimalPart !== undefined) {
        // Check if decimalPart exists
        if (decimalPlaces != null && decimalPart.length > decimalPlaces) {
          decimalPart = decimalPart.slice(0, decimalPlaces);
        }
        // Reconstruct numberPart after constraints
        numberPart = integerPart + "." + decimalPart;
      } else {
        numberPart = integerPart;
      }

      // Reconstruct cleanNumericString after constraints for `onChange`
      cleanNumericString = sign + numberPart;

      // 4. Format the integer part with commas for display
      let formattedIntegerPart = integerPart;
      if (integerPart) {
        // Only format if integerPart is not empty
        const numInt = parseFloat(integerPart); // Convert to number for toLocaleString
        if (!isNaN(numInt) || integerPart.match(/^0+$/)) {
          // Handles "0", "00", etc.
          // Use toLocaleString for robust comma formatting of the integer part only
          formattedIntegerPart = numInt.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        }
        // If integerPart was "00" and became "0", but user is typing "001", this is fine.
      }

      // 5. Construct the display string
      let formattedDisplayString = sign + formattedIntegerPart;
      if (decimalPart !== undefined) {
        formattedDisplayString += "." + decimalPart;
      } else if (
        numberPart.endsWith(".") &&
        decimalPlaces > 0 &&
        numberPart.length > 0 &&
        integerPart.length >= 0
      ) {
        // If user typed "123.", keep the dot for display if decimals allowed
        // (integerPart could be empty if it was "0." and user deleted 0)
        if (formattedDisplayString === sign && numberPart === ".") {
          // handles "." -> "0." or "-." -> "-0."
          formattedDisplayString = sign + "0.";
        } else if (!formattedDisplayString.endsWith(".")) {
          formattedDisplayString += ".";
        }
      }
      // Handle "0." or "-0." explicitly if that's the state
      if (cleanNumericString === "0." && decimalPlaces > 0)
        formattedDisplayString = "0.";
      if (cleanNumericString === "-0." && decimalPlaces > 0)
        formattedDisplayString = "-0.";

      setRawInput(formattedDisplayString);
      onChange(cleanNumericString); // Propagate the unformatted clean numeric string
      if (!touched) setTouched(true);
    };

    // Effect for precise cursor management after DOM updates
    useLayoutEffect(() => {
      if (focused && inputRef.current) {
        const currentInputElement = inputRef.current;
        const { value: prevViewValue, cursor: prevCursorPos } =
          previousCursorData.current;
        const currentViewValue = rawInput; // The value set by setRawInput in handleChange

        // Only manage cursor if the value actually changed or cursor needs adjustment
        if (
          prevViewValue === currentViewValue &&
          currentInputElement.value === currentViewValue &&
          currentInputElement.selectionStart === prevCursorPos
        ) {
          return; // No change, no need to adjust cursor
        }

        // Calculate how many "real" (non-comma) characters were before the cursor in the previous view value
        let realCharsBeforePrevCursor = 0;
        for (let i = 0; i < prevCursorPos; i++) {
          if (prevViewValue[i] !== ",") {
            realCharsBeforePrevCursor++;
          }
        }

        // Find the new physical cursor position in the current view value
        // by placing it after the same number of "real" characters.
        let newCalculatedCursorPos = 0;
        let currentRealCharsCount = 0;
        for (let i = 0; i < currentViewValue.length; i++) {
          if (currentViewValue[i] !== ",") {
            currentRealCharsCount++;
          }
          newCalculatedCursorPos++;
          if (currentRealCharsCount >= realCharsBeforePrevCursor) {
            // If a character was added (prevViewValue shorter than currentViewValue)
            // and the character at newCalculatedCursorPos-1 is the one just typed (not a comma)
            // ensure cursor is AFTER it.
            // This logic is tricky; the current loop places it after the Nth real char.
            break;
          }
        }

        // If all real characters were deleted before cursor, place cursor at the start of remaining real chars or end.
        if (
          currentRealCharsCount < realCharsBeforePrevCursor &&
          currentRealCharsCount === 0 &&
          currentViewValue.length > 0
        ) {
          newCalculatedCursorPos = 0; // Or 1 if it's like "-"?
          if (currentViewValue.startsWith("-")) newCalculatedCursorPos = 1;
        } else if (currentRealCharsCount < realCharsBeforePrevCursor) {
          // If deletion happened, place cursor at the end of the current real characters.
          // Iterate to find the end of real characters in currentViewValue
          let tempPos = 0;
          let tempRealCount = 0;
          for (let i = 0; i < currentViewValue.length; i++) {
            if (currentViewValue[i] !== ",") tempRealCount++;
            tempPos++;
            if (tempRealCount >= currentRealCharsCount) break;
          }
          newCalculatedCursorPos = tempPos;
        }

        // Ensure cursor is within bounds of the actual current input value
        const finalCursorPos = Math.max(
          0,
          Math.min(newCalculatedCursorPos, currentInputElement.value.length)
        );

        // Check if DOM has updated with rawInput value before setting selection
        if (currentInputElement.value === currentViewValue) {
          currentInputElement.setSelectionRange(finalCursorPos, finalCursorPos);
        }
      }
    }, [rawInput, focused]); // Effect runs when rawInput (display value) or focus state changes

    // Handle blur: format fully and propagate clean value
    const handleBlur = () => {
      setFocused(false);
      setTouched(true);

      const cleanNumericOnBlur = getNumericString(rawInput, decimalPlaces);
      let finalValueToPropagate = cleanNumericOnBlur;

      if (cleanNumericOnBlur === "" || cleanNumericOnBlur === "-") {
        if (required) {
          // Invalid if required and empty or just "-"
        }
        setRawInput(cleanNumericOnBlur === "-" ? "-" : ""); // Keep "-" if that's it, else ""
        finalValueToPropagate = cleanNumericOnBlur === "-" ? "-" : "";
      } else {
        const num = parseFloat(cleanNumericOnBlur);
        if (!isNaN(num)) {
          // Ensure the propagated value has the correct number of decimal places as a string
          finalValueToPropagate = num.toFixed(decimalPlaces);
          setRawInput(formatNumber(finalValueToPropagate, decimalPlaces)); // Display fully formatted
        } else {
          // If still not a number (e.g. bad input somehow), keep clean string
          setRawInput(cleanNumericOnBlur); // Display the cleaned (but potentially invalid) input
          finalValueToPropagate = cleanNumericOnBlur;
        }
      }
      onChange(finalValueToPropagate);
    };

    // displayValue is always rawInput, as its state (formatted/de-formatted) is managed by handlers
    const displayValue = rawInput;

    return (
      <div
        className={`input-group numeric-input-wrapper ${
          showError ? "error" : ""
        }`}
      >
        {head && <div className="group-label">{head}</div>}
        <div className="numeric-input-inner">
          <span className="left-label">{label}</span>
          <input
            ref={inputRef}
            type="text" // Must be text to allow commas
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`numeric-input ${showError ? "input-error" : ""}`}
            placeholder={suggest}
            inputMode="decimal" // Suggests appropriate keyboard on mobile
            onKeyDown={(e) => {
              // Prevent submission on Enter if needed, or other specific key handling
              if (e.key === "Enter") {
                // e.preventDefault(); // Uncomment to prevent form submission on Enter
                // inputRef.current?.blur(); // Optionally blur on Enter
              }
            }}
          />
        </div>
        {showError && <div className="text-error-message">{errorMessage}</div>}
      </div>
    );
  }
);

export default NumericTextInput;
