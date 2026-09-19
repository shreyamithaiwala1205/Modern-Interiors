/**
 * Standardized Project Categories for Modern Interiors
 * Used across Admin Portal, Public Gallery, and Footer.
 */

export const PROJECT_CATEGORIES = [
    { value: "Living", label: "Living Room" },
    { value: "Bedroom", label: "Bedroom" },
    { value: "Kitchen", label: "Modular Kitchen" },
    { value: "Office", label: "Office Interior" },
    { value: "Commercial", label: "Commercial Design" },
    { value: "Villa", label: "Luxury Villa" },
    { value: "Dining", label: "Dining Room" },
    { value: "Residential", label: "Residential" },
];

export const PROJECT_CATEGORY_VALUES = PROJECT_CATEGORIES.map((c) => c.value);

/**
 * Normalizes any category string into the canonical project category value.
 */
export const normalizeCategory = (cat) => {
    if (!cat) return "Other";
    const str = String(cat).trim().toLowerCase();

    if (str.includes("living")) return "Living";
    if (str.includes("bed")) return "Bedroom";
    if (str.includes("kitchen")) return "Kitchen";
    if (str.includes("office")) return "Office";
    if (str.includes("commercial")) return "Commercial";
    if (str.includes("villa")) return "Villa";
    if (str.includes("dining")) return "Dining";
    if (str.includes("residential")) return "Residential";

    // Check exact match
    const found = PROJECT_CATEGORIES.find(
        (c) => c.value.toLowerCase() === str || c.label.toLowerCase() === str
    );
    return found ? found.value : cat;
};

export default PROJECT_CATEGORIES;
