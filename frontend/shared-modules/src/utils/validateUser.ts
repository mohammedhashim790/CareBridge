import type {ValidationResult} from "./types/auth";

export function validateUserInput(email: string, password: string): ValidationResult {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Invalid email format.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,./?]).{8,}$/;

    if (!passwordRegex.test(password)) {
        errors.push("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
    }

    return {
        isValid: errors.length === 0, errors,
    };
}

export function validateForgotPasswordInput(email: string): ValidationResult {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Invalid email format.");
    }
    return {
        isValid: errors.length === 0, errors,
    };
}
