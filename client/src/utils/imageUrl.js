const BACKEND_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
    if (!image) {
        return "";
    }

    const value = String(image).trim();

    if (!value) {
        return "";
    }

    // Full URL
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    // Already backend path
    if (value.startsWith("/uploads/")) {
        return `${BACKEND_URL}${value}`;
    }

    if (value.startsWith("/images/")) {
        return `${BACKEND_URL}${value}`;
    }

    // Stored as uploads/filename
    if (value.startsWith("uploads/")) {
        return `${BACKEND_URL}/${value}`;
    }

    if (value.startsWith("images/")) {
        return `${BACKEND_URL}/${value}`;
    }

    // Stored only as filename
    return `${BACKEND_URL}/uploads/${value}`;
};

export default getImageUrl;