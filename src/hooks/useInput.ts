import { useCallback, useEffect, useRef, useState } from "react";

export function noModifier(input: string) {
  return input;
}

const NoValidator = () => "";

export default function useInput(
  initialValue: string,
  errorValidator: (input: string) => string = NoValidator,
  modifier: (input: string) => string = noModifier,
  required = true
) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(!required);
  const [error, setError] = useState("");

  const isInitialMount = useRef(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(modifier(newVal));
  };

  const validate = useCallback(() => {
    if (required && value === "") {
      setError("Required");
      return;
    }
    const error = errorValidator(value);
    setIsValid(error === "");
    setError(error);
  }, [errorValidator, required, value]);

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    else validate();
  }, [value, validate]);

  return { value, handleChange, setValue, isValid, error, validate };
}