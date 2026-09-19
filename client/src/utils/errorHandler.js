/**
 * Error Sanitizer Utility for Modern Interiors
 * Transforms technical database/server errors into clear, professional, user-friendly messages.
 */

export const getFriendlyErrorMessage = (
  error,
  defaultFallback = "Something went wrong. Please try again later."
) => {
  // Network error or server completely unreachable
  if (!error?.response) {
    return "Unable to reach the server. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const rawMessage = error.response.data?.message;

  // Technical keywords that should never be shown to end users
  const technicalKeywords = [
    "getaddrinfo",
    "enotfound",
    "econnrefused",
    "etimedout",
    "mongodb",
    "mongoose",
    "mongoserverselectionerror",
    "mongonetworkerror",
    "e11000",
    "duplicate key",
    "timed out",
    "timeout",
    "buffering",
    "socket hang up",
    "cannot read properties",
    "cast to objectid",
    "internal server error",
    "server error",
    "jwt malformed",
    "invalid signature",
  ];

  const msgLower = (typeof rawMessage === "string" ? rawMessage : "").toLowerCase();

  const isTechnical =
    status >= 500 ||
    !rawMessage ||
    typeof rawMessage !== "string" ||
    technicalKeywords.some((keyword) => msgLower.includes(keyword));

  if (isTechnical) {
    if (status === 503 || status === 504) {
      return "Service is temporarily unavailable. Please try again in a few moments.";
    }
    return defaultFallback;
  }

  // Specific user-friendly rewrites for authentication messages
  if (rawMessage === "Invalid Email" || rawMessage === "Invalid Password") {
    return "Invalid email address or password. Please check your credentials.";
  }

  if (rawMessage === "User Not Found") {
    return "No account found with this email address.";
  }

  if (rawMessage === "User already exists.") {
    return "An account with this email already exists. Please log in instead.";
  }

  return rawMessage;
};
