export const MAX_MESSAGE_LENGTH = 4000;
export const MIN_MESSAGE_LENGTH = 1;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateMessage(message: string): ValidationResult {
  if (!message.trim()) {
    return {
      isValid: false,
      error: "Message cannot be empty"
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
    };
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: "Message too short"
    };
  }

  return { isValid: true };
}

export function validateApiKey(): ValidationResult {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  
  if (!apiKey) {
    return {
      isValid: false,
      error: "API key not configured. Please set NEXT_PUBLIC_GOOGLE_API_KEY in your environment variables."
    };
  }

  if (apiKey.length < 10) {
    return {
      isValid: false,
      error: "Invalid API key format"
    };
  }

  return { isValid: true };
} 