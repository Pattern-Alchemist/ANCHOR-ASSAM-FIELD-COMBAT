// Data validation and error handling utilities

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  videoFile: (file: File): boolean => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
    return validTypes.includes(file.type);
  },
  
  fileSize: (file: File, maxSizeMB: number = 500): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },
  
  nonEmpty: (value: string | unknown[]): boolean => {
    return Array.isArray(value) ? value.length > 0 : value.toString().trim().length > 0;
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

export const validateForm = (
  formData: Record<string, unknown>,
  schema: Record<string, (value: unknown) => boolean>
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  Object.entries(schema).forEach(([field, validator]) => {
    if (!validator(formData[field])) {
      errors[field] = `${field} is invalid`;
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const handleError = (error: unknown): { message: string; code: string } => {
  if (error instanceof ValidationError) {
    return { message: error.message, code: 'VALIDATION_ERROR' };
  }
  if (error instanceof Error) {
    return { message: error.message, code: 'ERROR' };
  }
  return { message: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
};
