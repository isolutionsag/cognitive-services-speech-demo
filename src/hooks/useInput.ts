import { useEffect, useRef, useState } from "react";

export function noModifier(input: string) {
    return input
}

    return mod
}

export const numberErrorValidator = (numAsString: string) => {
    try {
        const asNum = parseInt(numAsString);
        console.log("Input as num: " + asNum)
        if (asNum <= 21) return ""
        return "Cannot be bigger than 21"
    } catch (error) {
        return "Input must be a number"
    }
}

export default function useInput(initialValue: string, errorValidator: (input: string) => string, modifier: (input: string) => string = noModifier, required = true) {
    const [value, setValue] = useState(initialValue);
    const [isValid, setIsValid] = useState(!required);
    const [error, setError] = useState("")

    const isInitialMount = useRef(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setValue(modifier(newVal))
    }

    useEffect(() => {
        if (isInitialMount.current)
            isInitialMount.current = false
        else
            validate()
    }, [value])

    const validate = () => {
        if (required && value === "") {
            setError("Required")
            return
        }
        const error = errorValidator(value)
        setIsValid(error === "")
        setError(error)
    }

    return { value, handleChange, setValue, isValid, error, validate }
}