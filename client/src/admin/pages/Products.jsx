import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Trash2,
  Pencil,
  Eye,
  Download,
  Package,
} from "lucide-react";

import AdminLayout from "../AdminLayout";
import toast from "react-hot-toast";

import getImageUrl from "../../utils/imageUrl";

import "../css/Products.css";

const TAG_OPTIONS = [
  "New Arrival",
  "Bestseller",
  "Trending",
  "Limited Stock",
  "Sale",
  "Featured",
];

const toCsv = (value) =>
  Array.isArray(value)
    ? value.join(", ")
    : value || "";

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  let formattedValue = value;

  if (Array.isArray(value)) {
    formattedValue = value.join(", ");
  } else if (typeof value === "object") {
    formattedValue = JSON.stringify(value);
  }

  formattedValue = String(formattedValue);

  return `"${formattedValue.replace(/"/g, '""')}"`;
};

const exportProductsCSV = (products) => {
  if (!products || products.length === 0) {
    toast.error("No products available to export");
    return;
  }

  const headers = [
    "Product ID",
    "Name",
    "Price",
    "Price Value",
    "Category",
    "Material",
    "Stock",
    "Rating",
    "Description",
    "Tags",
    "Colors",
    "Dimensions",
    "Warranty",
    "Delivery",
    "Features",
    "Image",
    "Visibility",
    "Auto Hidden Due To Stock",
    "Created At",
    "Updated At",
  ];

  const rows = products.map((product) => [
    product._id,
    product.name,
    product.price,
    product.priceValue,
    product.category,
    product.material,
    product.stock,
    product.rating,
    product.description,
    product.tags,
    product.colors,
    product.dimensions,
    product.warranty,
    product.delivery,
    product.features,
    product.image,
    product.isVisible !== false ? "Visible" : "Hidden",
    product.autoHiddenDueToStock ? "Yes" : "No",
    product.createdAt,
    product.updatedAt,
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(",")
    ),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `modern-interiors-products-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  toast.success(
    `${products.length} products exported successfully`
  );
};

const Products = () => {

  /* =====================================================
     TAG PICKER
  ===================================================== */

  const toggleTag = (setter, tagValue) => {

    setter((prev) => {

      const current = Array.isArray(prev.tags)
        ? prev.tags
        : [];

      const exists = current.includes(tagValue);

      return {
        ...prev,
        tags: exists
          ? current.filter(
              (item) => item !== tagValue
            )
          : [...current, tagValue],
      };

    });

  };


  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({
      name: "",
      price: "",
      priceValue: "",
      category: "",
      material: "",
      stock: "",
      description: "",
      image: null,
      tags: [],
      colors: "",
      dimensions: "",
      warranty: "",
      delivery: "",
      features: "",
    });


  /* =====================================================
     PRODUCTS
  ===================================================== */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =====================================================
     SEARCH / FILTER / SORT
  ===================================================== */

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");


  /* =====================================================
     VIEW / EDIT
  ===================================================== */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editProduct, setEditProduct] =
    useState({});


  /* =====================================================
     CATEGORIES
  ===================================================== */

  const [categories, setCategories] =
    useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(false);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 5;


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    fetchProducts();
    fetchCategories();

  }, []);


  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  const fetchCategories = async () => {

    try {

      setLoadingCategories(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const { data } =
        await axios.get(
          "http://localhost:5000/api/admin/products/categories",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (
        data?.success &&
        Array.isArray(
          data.categories
        )
      ) {

        setCategories(
          data.categories
        );

      }

    } catch (err) {

      console.log(
        "FETCH CATEGORIES ERROR:",
        err
      );

      setCategories([
        "Living",
        "Bedroom",
        "Dining",
        "Office",
        "Kitchen",
        "Decor",
        "Outdoor",
        "Lighting",
        "Storage",
      ]);

    } finally {

      setLoadingCategories(false);

    }

  };


  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem(
          "token"
        );


      const { data } =
        await axios.get(
          "http://localhost:5000/api/admin/products",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      setProducts(
        Array.isArray(
          data.products
        )
          ? data.products
          : []
      );

    } catch (err) {

      console.log(
        "FETCH PRODUCTS ERROR:",
        err
      );

      setError(
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const deleteProduct =
    async (id) => {

      if (
        !window.confirm(
          "Delete this product?"
        )
      ) {

        return;

      }


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        const { data } =
          await axios.delete(
            `http://localhost:5000/api/admin/products/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        toast.success(
          data.message ||
          "Product deleted successfully"
        );


        setShowModal(
          false
        );

        setShowEditModal(
          false
        );

        setSelectedProduct(
          null
        );


        fetchProducts();

      } catch (err) {

        toast.error(
          err.response?.data
            ?.message ||
          "Delete Failed"
        );

      }

    };


  /* =====================================================
     TOGGLE PRODUCT VISIBILITY
  ===================================================== */

  const [togglingId, setTogglingId] =
    useState(null);

  // Product currently awaiting a restock quantity before it can be
  // switched back on (replaces a native window.prompt with an
  // in-theme modal).
  const [restockTarget, setRestockTarget] =
    useState(null);

  const [restockValue, setRestockValue] =
    useState("");

  const applyVisibilityToggle =
    async (product, restockQty) => {

      try {

        setTogglingId(
          product._id
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.patch(
            `http://localhost:5000/api/admin/products/${product._id}/visibility`,
            restockQty
              ? { stock: restockQty }
              : {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        toast.success(
          data.message ||
          "Visibility updated"
        );

        setProducts(
          (prev) =>
            prev.map(
              (item) =>
                item._id ===
                product._id
                  ? {
                      ...item,
                      isVisible:
                        data.product
                          ?.isVisible,
                      stock:
                        data.product
                          ?.stock ??
                        item.stock,
                      autoHiddenDueToStock:
                        data.product
                          ?.autoHiddenDueToStock,
                    }
                  : item
            )
        );

      } catch (err) {

        toast.error(
          err.response?.data
            ?.message ||
          "Failed to update visibility"
        );

      } finally {

        setTogglingId(
          null
        );

      }

    };

  const toggleVisibility =
    (product) => {

      const turningOn =
        product.isVisible === false;

      // Can't turn on a 0-stock product without restocking it —
      // open the restock modal instead of toggling right away.
      if (turningOn && Number(product.stock) <= 0) {
        setRestockValue("");
        setRestockTarget(product);
        return;
      }

      applyVisibilityToggle(product);

    };

  const confirmRestock = () => {

    const qty = Number(restockValue);

    if (!Number.isFinite(qty) || qty <= 0) {
      toast.error(
        "Please enter a valid stock quantity greater than 0."
      );
      return;
    }

    applyVisibilityToggle(restockTarget, qty);
    setRestockTarget(null);

  };


  /* =====================================================
     UPDATE PRODUCT
  ===================================================== */

  const updateProduct =
    async () => {

      try {

        if (
          !editProduct.name?.trim()
        ) {

          toast.error(
            "Product name is required"
          );

          return;

        }


        if (
          !editProduct.category
        ) {

          toast.error(
            "Please select a category"
          );

          return;

        }


        const token =
          localStorage.getItem(
            "token"
          );


        const { data } =
          await axios.put(
            `http://localhost:5000/api/admin/products/${editProduct._id}`,
            {
              ...editProduct,

              name:
                editProduct.name.trim(),
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        toast.success(
          data.message ||
          "Product updated successfully"
        );


        setShowEditModal(
          false
        );

        setShowModal(
          false
        );


        fetchProducts();

      } catch (err) {

        toast.error(
          err.response?.data
            ?.message ||
          "Update Failed"
        );

      }

    };


  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const addProduct =
    async () => {

      try {

        if (
          !newProduct.name.trim()
        ) {

          toast.error(
            "Product name is required"
          );

          return;

        }


        if (
          !newProduct.category
        ) {

          toast.error(
            "Please select a category"
          );

          return;

        }


        if (
          !newProduct.price
        ) {

          toast.error(
            "Display price is required"
          );

          return;

        }


        if (
          !newProduct.priceValue ||
          Number(
            newProduct.priceValue
          ) <= 0
        ) {

          toast.error(
            "Please enter a valid price value"
          );

          return;

        }


        if (
          newProduct.stock === "" ||
          Number(
            newProduct.stock
          ) < 0
        ) {

          toast.error(
            "Please enter valid stock quantity"
          );

          return;

        }


        if (
          !newProduct.image
        ) {

          toast.error(
            "Please select a product image"
          );

          return;

        }


        const token =
          localStorage.getItem(
            "token"
          );


        const formData =
          new FormData();


        formData.append(
          "name",
          newProduct.name.trim()
        );

        formData.append(
          "price",
          newProduct.price
        );

        formData.append(
          "priceValue",
          newProduct.priceValue
        );

        formData.append(
          "category",
          newProduct.category
        );

        formData.append(
          "material",
          newProduct.material
        );

        formData.append(
          "stock",
          newProduct.stock
        );

        formData.append(
          "description",
          newProduct.description
        );

        formData.append(
          "rating",
          5
        );

        formData.append(
          "tags",
          (newProduct.tags || []).join(",")
        );

        formData.append(
          "colors",
          newProduct.colors || ""
        );

        formData.append(
          "dimensions",
          newProduct.dimensions || ""
        );

        formData.append(
          "warranty",
          newProduct.warranty || ""
        );

        formData.append(
          "delivery",
          newProduct.delivery || ""
        );

        formData.append(
          "features",
          newProduct.features || ""
        );

        formData.append(
          "image",
          newProduct.image
        );


        const { data } =
          await axios.post(
            "http://localhost:5000/api/admin/products",
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );


        toast.success(
          data.message ||
          "Product added successfully"
        );


        setShowAddModal(
          false
        );


        setNewProduct({
          name: "",
          price: "",
          priceValue: "",
          category: "",
          material: "",
          stock: "",
          description: "",
          image: null,
          tags: [],
          colors: "",
          dimensions: "",
          warranty: "",
          delivery: "",
          features: "",
        });


        setCurrentPage(1);

        fetchProducts();

      } catch (err) {

        console.log(
          "ADD PRODUCT ERROR:",
          err
        );

        toast.error(
          err.response?.data
            ?.message ||
          "Product Add Failed"
        );

      }

    };


  /* =====================================================
     FILTER / SEARCH / SORT
  ===================================================== */

  const filteredProducts =
    products
      .filter(
        (product) => {

          const productName =
            String(
              product.name || ""
            ).toLowerCase();

          const searchText =
            search.toLowerCase();


          const matchSearch =
            productName.includes(
              searchText
            );


          const matchCategory =
            categoryFilter ===
              "all"
              ? true
              : product.category ===
                categoryFilter;


          return (
            matchSearch &&
            matchCategory
          );

        }
      )
      .sort(
        (a, b) => {

          switch (
            sortBy
          ) {

            case "az":

              return (
                String(
                  a.name || ""
                ).localeCompare(
                  String(
                    b.name || ""
                  )
                )
              );


            case "za":

              return (
                String(
                  b.name || ""
                ).localeCompare(
                  String(
                    a.name || ""
                  )
                )
              );


            case "priceLow":

              return (
                Number(
                  a.priceValue || 0
                ) -
                Number(
                  b.priceValue || 0
                )
              );


            case "priceHigh":

              return (
                Number(
                  b.priceValue || 0
                ) -
                Number(
                  a.priceValue || 0
                )
              );


            case "oldest":

              return (
                new Date(
                  a.createdAt
                ) -
                new Date(
                  b.createdAt
                )
              );


            default:

              return (
                new Date(
                  b.createdAt
                ) -
                new Date(
                  a.createdAt
                )
              );

          }

        }
      );


  /* =====================================================
     PAGINATION CALCULATION
  ===================================================== */

  const indexOfLast =
    currentPage *
    productsPerPage;


  const indexOfFirst =
    indexOfLast -
    productsPerPage;


  const currentProducts =
    filteredProducts.slice(
      indexOfFirst,
      indexOfLast
    );


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProducts.length /
        productsPerPage
      )
    );


  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalProducts =
    products.length;


  const totalCategories =
    [
      ...new Set(
        products
          .map(
            (p) =>
              p.category
          )
          .filter(Boolean)
      ),
    ].length;


  const lowStock =
    products.filter(
      (p) =>
        Number(
          p.stock || 0
        ) <= 5
    ).length;


  const totalStock =
    products.reduce(
      (sum, p) =>
        sum +
        Number(
          p.stock || 0
        ),
      0
    );


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <AdminLayout>

        <div className="products-page">

          <div className="products-loading-screen">

            <div className="products-loader"></div>

            <h2>
              Loading Products...
            </h2>

            <p>
              Please wait while product data is loading.
            </p>

          </div>

        </div>

      </AdminLayout>
    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (
      <AdminLayout>

        <h2>
          {error}
        </h2>

      </AdminLayout>
    );

  }


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <AdminLayout>

      <div className="products-page">


        {/* ==========================================
            PAGE TITLE
        ========================================== */}

        <div className="products-heading-row">

          <h1 className="products-title">
            Products Management
          </h1>

          <button
            type="button"
            className="products-heading-add-btn"
            onClick={() => {

              setNewProduct({
                name: "",
                price: "",
                priceValue: "",
                category: "",
                material: "",
                stock: "",
                description: "",
                image: null,
                tags: [],
                colors: "",
                dimensions: "",
                warranty: "",
                delivery: "",
                features: "",
              });

              setShowAddModal(true);

            }}
          >
            + Add Product
          </button>

        </div>


{/* ==========================================
    STATISTICS
========================================== */}

<div className="products-stats">

  <div className="order-stat-card">

    <div className="order-stat-icon total">
      <Package size={22} />
    </div>

    <div>
      <p>Total Products</p>

      <h3>
        <span>{totalProducts}</span>
      </h3>
    </div>

  </div>


  <div className="stats-card">

    <h3>
      Categories
    </h3>

    <span>
      {totalCategories}
    </span>

  </div>


  <div className="stats-card">

    <h3>
      Low Stock
    </h3>

    <span>
      {lowStock}
    </span>

  </div>


  <div className="stats-card">

    <h3>
      Total Stock
    </h3>

    <span>
      {totalStock}
    </span>

  </div>

</div>


        {/* ==========================================
            PRODUCTS TOOLBAR
        ========================================== */}

        <div className="products-toolbar">


          {/* LEFT */}

          <div className="products-toolbar-left">

            <div className="products-count">

              Total Products :{" "}

              <span>
                {
                  filteredProducts.length
                }
              </span>

            </div>

            <button 
              type="button" 
              className="export-csv-btn" 
              onClick={() => exportProductsCSV(products)} 
            >
              <Download size={15} /> 
              Export CSV 
            </button>
              
            {/* <button
              type="button"
              className="products-add-btn"
              onClick={() => {

                setNewProduct({
                  name: "",
                  price: "",
                  priceValue: "",
                  category: "",
                  material: "",
                  stock: "",
                  description: "",
                  image: null,
                  tags: [],
                  colors: "",
                  dimensions: "",
                  warranty: "",
                  delivery: "",
                  features: "",
                });

                setShowAddModal(
                  true
                );

              }}
            >
              +
              Add Product
            </button> */}

          </div>


          {/* RIGHT */}

          <div className="products-toolbar-right">

            <input
              type="text"
              placeholder="Search Product..."
              className="search-box"
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }}
            />


            <select
              className="filter-box"
              value={
                categoryFilter
              }
              onChange={(e) => {

                setCategoryFilter(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }}
            >

              <option value="all">
                All Categories
              </option>


              {categories.map(
                (cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>

                )
              )}

            </select>


            <select
              className="filter-box"
              value={sortBy}
              onChange={(e) => {

                setSortBy(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }}
            >

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="az">
                A-Z
              </option>

              <option value="za">
                Z-A
              </option>

              <option value="priceLow">
                Price Low
              </option>

              <option value="priceHigh">
                Price High
              </option>

            </select>

          </div>

        </div>


        {/* ==========================================
            PRODUCTS TABLE
        ========================================== */}

        <div className="products-table">

          <table>

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Image
                </th>

                <th>
                  Name
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Visibility
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {currentProducts.length >
              0 ? (

                currentProducts.map(
                  (
                    product,
                    index
                  ) => (

                    <tr
                      key={
                        product._id
                      }
                      className={
                        product.isVisible ===
                        false
                          ? "row-hidden"
                          : ""
                      }
                    >

                      <td>
                        {
                          indexOfFirst +
                          index +
                          1
                        }
                      </td>


                      <td>

                        <img
                          src={
                            getImageUrl(
                              product.image
                            )
                          }
                          alt={
                            product.name
                          }
                          className="product-thumb"
                        />

                      </td>


                      <td>
                        {
                          product.name
                        }
                      </td>


                      <td>
                        {
                          product.category
                        }
                      </td>


                      <td>
                        {
                          product.price
                        }
                      </td>


                      <td>

                        <span
                          className={
                            Number(
                              product.stock ||
                              0
                            ) <= 5
                              ? "stock low"
                              : "stock"
                          }
                        >
                          {
                            product.stock
                          }
                        </span>

                      </td>


                      <td>

                        ⭐{" "}
                        {
                          product.rating
                        }

                      </td>


                      <td>

                        <div className="visibility-toggle">

                          <label className="visibility-switch">

                            <input
                              type="checkbox"
                              checked={
                                product.isVisible !==
                                false
                              }
                              disabled={
                                togglingId ===
                                product._id
                              }
                              onChange={() =>
                                toggleVisibility(
                                  product
                                )
                              }
                            />

                            <span className="visibility-switch-track" />

                          </label>

                          <span
                            className={
                              `visibility-status ${
                                product.isVisible !==
                                false
                                  ? "visible"
                                  : "hidden"
                              }`
                            }
                          >
                            {
                              product.isVisible !==
                              false
                                ? "Visible"
                                : product.autoHiddenDueToStock
                                ? "Auto-hidden (0 stock)"
                                : "Hidden"
                            }
                          </span>

                        </div>

                      </td>


                      <td className="action-buttons">


                        {/* VIEW */}

                        <button
                          type="button"
                          className="view-btn"
                          onClick={() => {

                            setSelectedProduct(
                              product
                            );

                            setShowModal(
                              true
                            );

                          }}
                          title="View Product"
                        >

                          <Eye
                            size={18}
                          />

                        </button>


                        {/* EDIT */}

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => {

                            setEditProduct(
                              {
                                ...product,
                              }
                            );

                            setShowEditModal(
                              true
                            );

                          }}
                          title="Edit Product"
                        >

                          <Pencil
                            size={18}
                          />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
                          title="Delete Product"
                        >

                          <Trash2
                            size={18}
                          />

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No Products Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ==========================================
            PAGINATION
        ========================================== */}

        <div className="pagination">

          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            aria-label="Previous Page"
            title="Previous Page"
          >
            ‹
          </button>


          {[
            ...Array(
              totalPages
            ),
          ].map(
            (
              _,
              index
            ) => (

              <button
                type="button"
                key={index}
                className={
                  currentPage ===
                  index + 1
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >
                {
                  index + 1
                }
              </button>

            )
          )}


          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            aria-label="Next Page"
            title="Next Page"
          >
            ›
          </button>

        </div>


        {/* ==========================================
            VIEW PRODUCT MODAL
        ========================================== */}

        {showModal &&
          selectedProduct && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowModal(
                false
              )
            }
          >

            <div
              className="product-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <h2>
                  Product Details
                </h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>


              <div className="modal-body">

                <img
                  src={
                    getImageUrl(
                      selectedProduct.image
                    )
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="product-preview"
                />


                <div className="product-info">

                  <p>
                    <strong>
                      Name :
                    </strong>{" "}
                    {
                      selectedProduct.name
                    }
                  </p>


                  <p>
                    <strong>
                      Category :
                    </strong>{" "}
                    {
                      selectedProduct.category
                    }
                  </p>


                  <p>
                    <strong>
                      Material :
                    </strong>{" "}
                    {
                      selectedProduct.material
                    }
                  </p>


                  <p>
                    <strong>
                      Tags :
                    </strong>{" "}
                    {
                      Array.isArray(
                        selectedProduct.tags
                      ) &&
                      selectedProduct.tags
                        .length > 0
                        ? selectedProduct.tags.join(
                            ", "
                          )
                        : "None"
                    }
                  </p>


                  <p>
                    <strong>
                      Colors :
                    </strong>{" "}
                    {
                      toCsv(
                        selectedProduct.colors
                      ) || "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Dimensions :
                    </strong>{" "}
                    {
                      selectedProduct.dimensions ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Price :
                    </strong>{" "}
                    {
                      selectedProduct.price
                    }
                  </p>


                  <p>
                    <strong>
                      Stock :
                    </strong>{" "}
                    {
                      selectedProduct.stock
                    }
                  </p>


                  <p>
                    <strong>
                      Rating :
                    </strong>{" "}
                    ⭐{" "}
                    {
                      selectedProduct.rating
                    }
                  </p>


                  <p>
                    <strong>
                      Visibility :
                    </strong>{" "}
                    <span
                      className={
                        `visibility-status ${
                          selectedProduct.isVisible !==
                          false
                            ? "visible"
                            : "hidden"
                        }`
                      }
                    >
                      {
                        selectedProduct.isVisible !==
                        false
                          ? "Visible"
                          : "Hidden"
                      }
                    </span>
                  </p>


                  <p>
                    <strong>
                      Warranty :
                    </strong>{" "}
                    {
                      selectedProduct.warranty ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Delivery :
                    </strong>{" "}
                    {
                      selectedProduct.delivery ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Features :
                    </strong>{" "}
                    {
                      toCsv(
                        selectedProduct.features
                      ) || "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Description :
                    </strong>
                  </p>


                  <p>
                    {
                      selectedProduct.description ||
                      "-"
                    }
                  </p>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => {

                    setEditProduct(
                      {
                        ...selectedProduct,
                      }
                    );

                    setShowModal(
                      false
                    );

                    setShowEditModal(
                      true
                    );

                  }}
                >
                  Edit
                </button>


                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(
                      selectedProduct._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            EDIT PRODUCT MODAL
        ========================================== */}

        {showEditModal && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowEditModal(
                false
              )
            }
          >

            <div
              className="product-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <h2>
                  Edit Product
                </h2>


                <button
                  type="button"
                  className="close-btn"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>


              <div className="modal-body">

                <div className="edit-form">


                  {editProduct.image && (

                    <div
                      style={{
                        gridColumn:
                          "span 2",
                        textAlign:
                          "center",
                        marginBottom:
                          "6px",
                      }}
                    >

                      <img
                        src={
                          getImageUrl(
                            editProduct.image
                          )
                        }
                        alt={
                          editProduct.name ||
                          "Product"
                        }
                        className="product-preview"
                        style={{
                          margin:
                            "0 auto",
                          maxHeight:
                            "160px",
                        }}
                      />

                    </div>

                  )}


                  <div>

                    <label>
                      Product Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Velvet Lounge Chair"
                      value={
                        editProduct.name ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          name:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Category *
                    </label>

                    <select
                      required
                      value={
                        editProduct.category ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category:
                            e.target.value,
                        })
                      }
                    >

                      <option value="">
                        {
                          loadingCategories
                            ? "Loading categories..."
                            : "-- Select Category --"
                        }
                      </option>


                      {categories.map(
                        (cat) => (

                          <option
                            key={cat}
                            value={cat}
                          >
                            {cat}
                          </option>

                        )
                      )}


                      {editProduct.category &&
                        !categories.includes(
                          editProduct.category
                        ) && (

                        <option
                          value={
                            editProduct.category
                          }
                        >
                          {
                            editProduct.category
                          }
                        </option>

                      )}

                    </select>

                  </div>


                  <div>

                    <label>
                      Display Price
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. ₹24,999"
                      value={
                        editProduct.price ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Price Value (₹)
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 24999"
                      value={
                        editProduct.priceValue ??
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          priceValue:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Material
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Teak Wood / Velvet"
                      value={
                        editProduct.material ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          material:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Product Tags
                      {" "}
                      (select any that apply)
                    </label>

                    <div className="tag-picker">

                      {TAG_OPTIONS.map(
                        (tagOption) => {

                          const isSelected =
                            Array.isArray(
                              editProduct.tags
                            ) &&
                            editProduct.tags.includes(
                              tagOption
                            );

                          return (

                            <button
                              type="button"
                              key={tagOption}
                              className={
                                `tag-chip ${
                                  isSelected
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() =>
                                toggleTag(
                                  setEditProduct,
                                  tagOption
                                )
                              }
                            >
                              {tagOption}
                            </button>

                          );

                        }
                      )}

                    </div>

                  </div>


                  <div>

                    <label>
                      Stock Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 15"
                      value={
                        editProduct.stock ??
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Colors
                      {" "}
                      (comma separated)
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Beige, Gray, Brown"
                      value={
                        toCsv(
                          editProduct.colors
                        )
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          colors:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Dimensions
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 84 x 36 x 34 inches"
                      value={
                        editProduct.dimensions ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          dimensions:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Warranty
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 2 Years Manufacturer Warranty"
                      value={
                        editProduct.warranty ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          warranty:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Delivery
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Delivered in 5-7 Days"
                      value={
                        editProduct.delivery ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          delivery:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Features
                      {" "}
                      (comma separated)
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Stain Resistant, Easy to Clean"
                      value={
                        toCsv(
                          editProduct.features
                        )
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          features:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Description
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Product specifications and details..."
                      value={
                        editProduct.description ||
                        ""
                      }
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="edit-btn"
                  onClick={
                    updateProduct
                  }
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            ADD PRODUCT MODAL
        ========================================== */}

        {showAddModal && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowAddModal(
                false
              )
            }
          >

            <div
              className="product-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <h2>
                  Add Product
                </h2>


                <button
                  type="button"
                  className="close-btn"
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>


              <div className="modal-body">

                <div className="edit-form">


                  <div>

                    <label>
                      Product Name *
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Velvet Lounge Chair"
                      required
                      value={
                        newProduct.name
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Category *
                    </label>

                    <select
                      required
                      value={
                        newProduct.category
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category:
                            e.target.value,
                        })
                      }
                    >

                      <option value="">
                        {
                          loadingCategories
                            ? "Loading categories from database..."
                            : "-- Select Category from Database --"
                        }
                      </option>


                      {categories.map(
                        (cat) => (

                          <option
                            key={cat}
                            value={cat}
                          >
                            {cat}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  <div>

                    <label>
                      Display Price *
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. ₹24,999"
                      required
                      value={
                        newProduct.price
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Price Value (₹) *
                    </label>

                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 24999"
                      required
                      value={
                        newProduct.priceValue
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          priceValue:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Material
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Teak Wood / Velvet"
                      value={
                        newProduct.material
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          material:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Product Tags
                      {" "}
                      (select any that apply)
                    </label>

                    <div className="tag-picker">

                      {TAG_OPTIONS.map(
                        (tagOption) => {

                          const isSelected =
                            newProduct.tags.includes(
                              tagOption
                            );

                          return (

                            <button
                              type="button"
                              key={tagOption}
                              className={
                                `tag-chip ${
                                  isSelected
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() =>
                                toggleTag(
                                  setNewProduct,
                                  tagOption
                                )
                              }
                            >
                              {tagOption}
                            </button>

                          );

                        }
                      )}

                    </div>

                  </div>


                  <div>

                    <label>
                      Stock Quantity *
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 15"
                      required
                      value={
                        newProduct.stock
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Colors
                      {" "}
                      (comma separated)
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Beige, Gray, Brown"
                      value={
                        newProduct.colors
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Dimensions
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 84 x 36 x 34 inches"
                      value={
                        newProduct.dimensions
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          dimensions:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Warranty
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 2 Years Manufacturer Warranty"
                      value={
                        newProduct.warranty
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          warranty:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div>

                    <label>
                      Delivery
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Delivered in 5-7 Days"
                      value={
                        newProduct.delivery
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          delivery:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Features
                      {" "}
                      (comma separated)
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Stain Resistant, Easy to Clean"
                      value={
                        newProduct.features
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          features:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Product Image *
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          image:
                            e.target.files?.[0] ||
                            null,
                        })
                      }
                    />

                  </div>


                  <div
                    style={{
                      gridColumn:
                        "span 2",
                    }}
                  >

                    <label>
                      Description
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Product specifications and details..."
                      value={
                        newProduct.description
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="edit-btn"
                  onClick={
                    addProduct
                  }
                >
                  Add Product
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =====================================================
            RESTOCK MODAL (enable a 0-stock product)
        ===================================================== */}

        {restockTarget && (

          <div
            className="modal-overlay"
            onClick={() => setRestockTarget(null)}
          >

            <div
              className="restock-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="modal-header">

                <h2>Restock Product</h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setRestockTarget(null)}
                >
                  ✕
                </button>

              </div>

              <div className="modal-body">

                <p className="restock-modal-text">
                  <strong>{restockTarget.name}</strong> is out of
                  stock. Enter a quantity to restock it before
                  making it visible again.
                </p>

                <input
                  type="number"
                  min="1"
                  autoFocus
                  className="restock-input"
                  placeholder="Stock quantity"
                  value={restockValue}
                  onChange={(e) =>
                    setRestockValue(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRestock();
                  }}
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setRestockTarget(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="edit-btn"
                  onClick={confirmRestock}
                >
                  Enable Product
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>

  );

};

export default Products;