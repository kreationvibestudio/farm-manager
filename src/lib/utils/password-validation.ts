/**
 * Password validation utility
 * Enforces strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

const commonPasswords = [
  'password', 'password123', 'admin', 'admin123', '12345678', '123456789',
  'qwerty', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon', 'master'
];

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  } else {
    score += 1;
  }

  // Check against common passwords
  const lowerPassword = password.toLowerCase();
  if (commonPasswords.some(common => lowerPassword.includes(common))) {
    errors.push('Password is too common. Please choose a more unique password');
    score -= 2;
  }

  // Check for repeated characters (e.g., "aaaa" or "1111")
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password should not contain repeated characters (e.g., "aaaa" or "1111")');
    score -= 1;
  }

  // Determine strength
  if (score >= 5 && password.length >= 12) {
    strength = 'strong';
  } else if (score >= 4 && password.length >= 8) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  // If password is 8-11 chars, require all complexity checks to pass
  if (password.length >= 8 && password.length < 12) {
    const hasAllRequirements = 
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasAllRequirements) {
      errors.push('For passwords 8-11 characters, all complexity requirements must be met');
    }
  }

  return {
    isValid: errors.length === 0 && password.length >= 8,
    errors,
    strength
  };
}

export function getPasswordStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'strong':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'weak':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
