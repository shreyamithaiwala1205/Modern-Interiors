const mongoose = require("mongoose");

const projectCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        label: {
            type: String,
            required: [true, "Display label is required"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "ProjectCategory",
    projectCategorySchema
);
