export const SIGN_IN_FORM_COPY = {
  title: "Sign in",
  description: "Enter your email and password to access your account.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  submitButton: "Sign in",
  loadingButton: "Signing in…",
  forgotPasswordLink: "Forgot password?",
  signUpPrompt: "Don't have an account?",
  signUpLink: "Sign up",
  errorEmailRequired: "Email is required.",
  errorEmailInvalid: "Please enter a valid email address.",
  errorPasswordRequired: "Password is required.",
  errorInvalidCredential:
    "The email address or password is incorrect. Please try again.",
  errorAccountDisabled:
    "This account has been disabled. Please contact support.",
  errorTooManyRequests: "Too many failed attempts. Please try again later.",
  errorDefault: "An unexpected error occurred. Please try again.",
} as const;
