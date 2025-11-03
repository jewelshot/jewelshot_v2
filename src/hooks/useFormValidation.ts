/**
 * Form Validation Hook
 * Client-side form validation with error handling
 */

'use client';

import { useState } from 'react';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRules;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationRules: FieldValidation
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be at most ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name as string]: true }));

    const error = validateField(name as string, (values[name] as string) || '');
    if (error) {
      setErrors((prev) => ({ ...prev, [name as string]: error }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, (values[fieldName as keyof T] as string) || '');
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
