const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD PATH
// =====================================================

const uploadPath = path.join(
    __dirname,
    "..",
    "uploads"
);

// =====================================================
// CREATE UPLOAD FOLDER
// =====================================================

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true,
    });

}

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadPath
        );

    },

    filename: (req, file, cb) => {

        const extension =
            path
                .extname(file.originalname)
                .toLowerCase();

        cb(
            null,
            `${Date.now()}${extension}`
        );

    },

});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );

    }

};

// =====================================================
// MULTER
// =====================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize:
            5 * 1024 * 1024,
    },

});

// =====================================================
// EXPORT
// =====================================================

module.exports = upload;