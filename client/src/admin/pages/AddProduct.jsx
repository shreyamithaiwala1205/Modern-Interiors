import React, { useState } from "react";
import axios from "axios";
import {
    Upload,
    X,
    Save,
    ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../AdminLayout";
import "../css/AddProduct.css";


const AddProduct = () => {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        name: "",

        price: "",

        priceValue: "",

        category: "",

        material: "",

        stock: "",

        rating: "4.5",

        description: "",

        colors: "",

        dimensions: "",

        warranty: "",

        delivery: "",

        features: "",
    });


    // =====================================================
    // IMAGE
    // =====================================================

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,
        }));
    };


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        // Allowed image types

        const allowedTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            toast.error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            e.target.value = "";

            return;
        }


        // 5 MB limit

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            toast.error(
                "Image size must be less than 5MB."
            );

            e.target.value = "";

            return;
        }


        setImage(file);


        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {

        setImage(null);

        setPreview("");


        const fileInput =
            document.getElementById(
                "product-image"
            );


        if (fileInput) {

            fileInput.value = "";
        }
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (
            !formData.name.trim()
        ) {

            toast.error(
                "Product name is required."
            );

            return false;
        }


        if (
            !formData.price.trim()
        ) {

            toast.error(
                "Display price is required."
            );

            return false;
        }


        if (
            formData.priceValue === "" ||
            Number.isNaN(
                Number(formData.priceValue)
            ) ||
            Number(formData.priceValue) < 0
        ) {

            toast.error(
                "Please enter a valid price value."
            );

            return false;
        }


        if (
            !formData.category
        ) {

            toast.error(
                "Please select a category."
            );

            return false;
        }


        if (
            !formData.material.trim()
        ) {

            toast.error(
                "Material is required."
            );

            return false;
        }


        if (
            formData.stock === "" ||
            Number.isNaN(
                Number(formData.stock)
            ) ||
            Number(formData.stock) < 0
        ) {

            toast.error(
                "Please enter a valid stock."
            );

            return false;
        }


        if (
            !formData.description.trim()
        ) {

            toast.error(
                "Product description is required."
            );

            return false;
        }


        if (!image) {

            toast.error(
                "Please upload a product image."
            );

            return false;
        }


        return true;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!validateForm()) {
            return;
        }


        try {

            setLoading(true);


            // =================================================
            // TOKEN
            // =================================================

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                toast.error(
                    "Admin session expired. Please login again."
                );

                navigate(
                    "/admin/login"
                );

                return;
            }


            // =================================================
            // FORMDATA
            // =================================================

            const data =
                new FormData();


            data.append(
                "name",
                formData.name.trim()
            );


            data.append(
                "price",
                formData.price.trim()
            );


            data.append(
                "priceValue",
                String(
                    Number(
                        formData.priceValue
                    )
                )
            );


            data.append(
                "category",
                formData.category
            );


            data.append(
                "material",
                formData.material.trim()
            );


            data.append(
                "stock",
                String(
                    Number(
                        formData.stock
                    )
                )
            );


            data.append(
                "rating",
                String(
                    Number(
                        formData.rating
                    ) || 4.5
                )
            );


            data.append(
                "description",
                formData.description.trim()
            );


            // =================================================
            // COLORS
            // =================================================

            const colorsArray =
                formData.colors
                    .split(",")
                    .map(
                        (color) =>
                            color.trim()
                    )
                    .filter(Boolean);


            colorsArray.forEach(
                (color) => {

                    data.append(
                        "colors",
                        color
                    );
                }
            );


            // =================================================
            // DIMENSIONS
            // =================================================

            data.append(
                "dimensions",
                formData.dimensions.trim()
            );


            // =================================================
            // WARRANTY
            // =================================================

            data.append(
                "warranty",
                formData.warranty.trim()
            );


            // =================================================
            // DELIVERY
            // =================================================

            data.append(
                "delivery",
                formData.delivery.trim()
            );


            // =================================================
            // FEATURES
            // =================================================

            const featuresArray =
                formData.features
                    .split(",")
                    .map(
                        (feature) =>
                            feature.trim()
                    )
                    .filter(Boolean);


            featuresArray.forEach(
                (feature) => {

                    data.append(
                        "features",
                        feature
                    );
                }
            );


            // =================================================
            // IMAGE
            // =================================================

            data.append(
                "image",
                image
            );


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "\n========== ADD PRODUCT =========="
            );

            console.log(
                "Name:",
                formData.name
            );

            console.log(
                "Price:",
                formData.price
            );

            console.log(
                "Price Value:",
                formData.priceValue
            );

            console.log(
                "Category:",
                formData.category
            );

            console.log(
                "Material:",
                formData.material
            );

            console.log(
                "Stock:",
                formData.stock
            );

            console.log(
                "Description:",
                formData.description
            );

            console.log(
                "Image:",
                image
            );


            // =================================================
            // API
            // =================================================

            const response =
                await axios.post(

                    "http://localhost:5000/api/admin/products",

                    data,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                        },
                    }
                );


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "PRODUCT RESPONSE:",
                response.data
            );


            toast.success(
                response.data?.message ||
                "Product added successfully!"
            );


            // Navigate after success

            setTimeout(() => {

                navigate(
                    "/admin/products"
                );

            }, 700);


        } catch (error) {

            console.error(
                "ADD PRODUCT ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "RESPONSE:",
                error.response?.data
            );


            // =================================================
            // 401
            // =================================================

            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Session expired. Please login again."
                );


                localStorage.removeItem(
                    "token"
                );


                navigate(
                    "/admin/login"
                );


                return;
            }


            // =================================================
            // 403
            // =================================================

            if (
                error.response?.status === 403
            ) {

                toast.error(
                    "You are not authorized as admin."
                );

                return;
            }


            // =================================================
            // 400
            // =================================================

            if (
                error.response?.status === 400
            ) {

                toast.error(
                    error.response?.data?.message ||
                    "Please check all required fields."
                );

                return;
            }


            // =================================================
            // OTHER
            // =================================================

            toast.error(
                error.response?.data?.message ||
                "Failed to add product."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <AdminLayout>

            <div className="add-product-page">

                {/* HEADER */}

                <div className="add-product-header">

                    <div>

                        <h1>
                            Add Product
                        </h1>

                        <p>
                            Add a new furniture
                            product to your
                            Modern Interiors
                            collection.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="back-products-btn"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Back to Products

                    </button>

                </div>


                {/* FORM */}

                <form
                    className="add-product-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* BASIC INFORMATION */}

                    <div className="form-section">

                        <div className="section-title">

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Enter the basic
                                details of your
                                furniture product.
                            </p>

                        </div>


                        <div className="form-grid">

                            {/* NAME */}

                            <div className="form-group full-width">

                                <label>
                                    Product Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Modern Velvet Sofa"
                                />

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Display Price
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="₹49,999"
                                />

                                <small>
                                    Example:
                                    ₹49,999
                                </small>

                            </div>


                            {/* PRICE VALUE */}

                            <div className="form-group">

                                <label>
                                    Price Value
                                    <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="priceValue"
                                    value={
                                        formData.priceValue
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="49999"
                                    min="0"
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category
                                    <span>*</span>
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Sofa">
                                        Sofa
                                    </option>

                                    <option value="Chair">
                                        Chair
                                    </option>

                                    <option value="Table">
                                        Table
                                    </option>

                                    <option value="Bed">
                                        Bed
                                    </option>

                                    <option value="Wardrobe">
                                        Wardrobe
                                    </option>

                                    <option value="Dining">
                                        Dining
                                    </option>

                                    <option value="Decor">
                                        Decor
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* MATERIAL */}

                            <div className="form-group">

                                <label>
                                    Material
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="material"
                                    value={
                                        formData.material
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Solid Wood"
                                />

                            </div>


                            {/* STOCK */}

                            <div className="form-group">

                                <label>
                                    Stock
                                    <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10"
                                    min="0"
                                />

                            </div>


                            {/* RATING */}

                            <div className="form-group">

                                <label>
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={
                                        formData.rating
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />

                            </div>

                        </div>

                    </div>


                    {/* IMAGE */}

                    <div className="form-section">

                        <div className="section-title">

                            <h2>
                                Product Image
                            </h2>

                            <p>
                                Upload the main
                                image of your
                                furniture product.
                            </p>

                        </div>


                        <div className="image-upload-area">

                            {preview ? (

                                <div className="image-preview">

                                    <img
                                        src={preview}
                                        alt="Product Preview"
                                    />

                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={
                                            removeImage
                                        }
                                    >

                                        <X
                                            size={18}
                                        />

                                    </button>

                                </div>

                            ) : (

                                <label
                                    htmlFor="product-image"
                                    className="upload-box"
                                >

                                    <Upload
                                        size={35}
                                    />

                                    <strong>
                                        Click to upload image
                                    </strong>

                                    <span>
                                        PNG, JPG or WEBP
                                    </span>

                                    <small>
                                        Maximum size:
                                        5MB
                                    </small>

                                </label>
                            )}


                            <input
                                id="product-image"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={
                                    handleImageChange
                                }
                                hidden
                            />

                        </div>

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="form-section">

                        <div className="section-title">

                            <h2>
                                Product Details
                            </h2>

                            <p>
                                Add additional
                                information about
                                the product.
                            </p>

                        </div>


                        <div className="form-grid">

                            {/* DESCRIPTION */}

                            <div className="form-group full-width">

                                <label>
                                    Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="5"
                                    placeholder="Write a detailed description of the product..."
                                />

                            </div>


                            {/* COLORS */}

                            <div className="form-group">

                                <label>
                                    Colors
                                </label>

                                <input
                                    type="text"
                                    name="colors"
                                    value={
                                        formData.colors
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Black, Brown, Beige"
                                />

                                <small>
                                    Separate colors
                                    with commas.
                                </small>

                            </div>


                            {/* DIMENSIONS */}

                            <div className="form-group">

                                <label>
                                    Dimensions
                                </label>

                                <input
                                    type="text"
                                    name="dimensions"
                                    value={
                                        formData.dimensions
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="78 × 32 × 30 inches"
                                />

                            </div>


                            {/* WARRANTY */}

                            <div className="form-group">

                                <label>
                                    Warranty
                                </label>

                                <input
                                    type="text"
                                    name="warranty"
                                    value={
                                        formData.warranty
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="3 Years"
                                />

                            </div>


                            {/* DELIVERY */}

                            <div className="form-group">

                                <label>
                                    Delivery
                                </label>

                                <input
                                    type="text"
                                    name="delivery"
                                    value={
                                        formData.delivery
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="5-7 Business Days"
                                />

                            </div>


                            {/* FEATURES */}

                            <div className="form-group full-width">

                                <label>
                                    Features
                                </label>

                                <textarea
                                    name="features"
                                    value={
                                        formData.features
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Premium fabric, Comfortable seating, Durable frame"
                                />

                                <small>
                                    Separate features
                                    with commas.
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-product-btn"
                            disabled={loading}
                        >

                            <Save
                                size={18}
                            />

                            {loading
                                ? "Saving..."
                                : "Save Product"}

                        </button>

                    </div>

                </form>

            </div>

        </AdminLayout>
    );
};


export default AddProduct;