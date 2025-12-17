/**
 * Normalize Google Gemini / GenAI errors
 */
const parseAIError = (err) => {
  let status = 503;
  let message = "AI service is currently unavailable. Please try again later.";
  let limit_quota_reached = false;

  try {
    // Gemini sometimes embeds JSON inside err.message
    const parsed =
      typeof err.message === "string" && err.message.trim().startsWith("{")
        ? JSON.parse(err.message)
        : null;

    const apiError = parsed?.error;

    // QUOTA / RATE LIMIT
    if (apiError?.status === "RESOURCE_EXHAUSTED") {
      status = 429;
      message =
        "AI quota has reached the maximum daily limit. Please try again later.";
      limit_quota_reached = true;
    }

    // INVALID REQUEST / BAD INPUT
    if (apiError?.status === "INVALID_ARGUMENT") {
      status = 400;
      message = "Invalid request sent to AI service.";
    }

    // UNAVAILABLE / MODEL OVERLOAD
    if (apiError?.status === "UNAVAILABLE") {
      status = 503;
      message = "AI service is temporarily unavailable. Please try again.";
    }
  } catch (parseError) {
    // Fallback if parsing fails
    console.error("AI error parsing failed:", parseError);
  }

  return {
    status,
    response: {
      success: false,
      message,
      limit_quota_reached,
    },
  };
};

module.exports = {
  parseAIError,
};
