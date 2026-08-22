const Product = require("../models/Furniture");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {

        console.error("GET PRODUCTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};


// =====================================================
// ADD PRODUCT
// =====================================================

const addProduct = async (req, res) => {

    try {

        const {
            name,
            price,
            priceValue,
            category,
            material,
            stock,
            rating,
            description,
            dimensions,
            warranty,
            delivery,
        } = req.body;


        // ==========================================
        // REQUIRED VALIDATION
        // ==========================================

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            });
        }


        if (!price || !String(price).trim()) {
            return res.status(400).json({
                success: false,
                message: "Product price is required",
            });
        }


        if (
            priceValue === undefined ||
            priceValue === null ||
            priceValue === "" ||
            Number.isNaN(Number(priceValue))
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid price value is required",
            });
        }


        if (!category || !String(category).trim()) {
            return res.status(400).json({
                success: false,
                message: "Product category is required",
            });
        }


        if (!material || !String(material).trim()) {
            return res.status(400).json({
                success: false,
                message: "Product material is required",
            });
        }


        if (
            stock === undefined ||
            stock === null ||
            stock === "" ||
            Number.isNaN(Number(stock))
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid stock is required",
            });
        }


        if (!description || !String(description).trim()) {
            return res.status(400).json({
                success: false,
                message: "Product description is required",
            });
        }


        // ==========================================
        // IMAGE VALIDATION
        // ==========================================

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required",
            });
        }


        // ==========================================
        // COLORS
        // ==========================================

        let colors = [];

        if (req.body.colors) {

            if (Array.isArray(req.body.colors)) {

                colors = req.body.colors
                    .map((item) => String(item).trim())
                    .filter(Boolean);

            } else {

                colors = String(req.body.colors)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }


        // ==========================================
        // FEATURES
        // ==========================================

        let features = [];

        if (req.body.features) {

            if (Array.isArray(req.body.features)) {

                features = req.body.features
                    .map((item) => String(item).trim())
                    .filter(Boolean);

            } else {

                features = String(req.body.features)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }


        // ==========================================
        // CREATE PRODUCT
        // ==========================================

        const product = await Product.create({

            name: String(name).trim(),

            price: String(price).trim(),

            priceValue: Number(priceValue),

            category: String(category).trim(),

            material: String(material).trim(),

            image: req.file.filename,

            rating:
                rating !== undefined &&
                rating !== "" &&
                !Number.isNaN(Number(rating))
                    ? Number(rating)
                    : 4.5,

            stock: Number(stock),

            description: String(description).trim(),

            colors,

            dimensions:
                dimensions
                    ? String(dimensions).trim()
                    : "",

            warranty:
                warranty
                    ? String(warranty).trim()
                    : "",

            delivery:
                delivery
                    ? String(delivery).trim()
                    : "",

            features,
        });


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message: "Product Added Successfully",

            product,
        });


    } catch (error) {

        console.error("ADD PRODUCT ERROR:", error);

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Product Add Failed",
        });
    }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found",
            });
        }


        if (req.body.name !== undefined)
            product.name =
                String(req.body.name).trim();


        if (req.body.price !== undefined)
            product.price =
                String(req.body.price).trim();


        if (req.body.priceValue !== undefined)
            product.priceValue =
                Number(req.body.priceValue);


        if (req.body.category !== undefined)
            product.category =
                String(req.body.category).trim();


        if (req.body.material !== undefined)
            product.material =
                String(req.body.material).trim();


        if (req.body.stock !== undefined)
            product.stock =
                Number(req.body.stock);


        if (req.body.rating !== undefined)
            product.rating =
                Number(req.body.rating);


        if (req.body.description !== undefined)
            product.description =
                String(req.body.description).trim();


        if (req.body.colors !== undefined) {

            product.colors =
                Array.isArray(req.body.colors)
                    ? req.body.colors
                    : String(req.body.colors).split(",");

            product.colors =
                product.colors
                    .map((item) =>
                        String(item).trim()
                    )
                    .filter(Boolean);
        }


        if (req.body.dimensions !== undefined)
            product.dimensions =
                String(req.body.dimensions).trim();


        if (req.body.warranty !== undefined)
            product.warranty =
                String(req.body.warranty).trim();


        if (req.body.delivery !== undefined)
            product.delivery =
                String(req.body.delivery).trim();


        if (req.body.features !== undefined) {

            product.features =
                Array.isArray(req.body.features)
                    ? req.body.features
                    : String(req.body.features).split(",");

            product.features =
                product.features
                    .map((item) =>
                        String(item).trim()
                    )
                    .filter(Boolean);
        }


        // ==========================================
        // NEW IMAGE
        // ==========================================

        if (req.file) {

            product.image =
                req.file.filename;
        }


        await product.save();


        return res.status(200).json({

            success: true,

            message: "Product Updated Successfully",

            product,
        });


    } catch (error) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Update Failed",
        });
    }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found",
            });
        }


        await product.deleteOne();


        return res.status(200).json({

            success: true,

            message: "Product Deleted Successfully",
        });


    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Delete Failed",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getProducts,

    addProduct,

    updateProduct,

    deleteProduct,

};