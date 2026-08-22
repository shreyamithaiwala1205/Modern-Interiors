import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

import AdminLayout from "../AdminLayout";

import getImageUrl from "../../utils/imageUrl";

import "../css/Products.css";

const Products = () => {

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
    });

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editProduct, setEditProduct] =
    useState({});

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 5;

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    try {

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
        data.products || []
      );

    } catch (err) {

      console.log(err);

      setError(
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }

  };

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

        alert(
          data.message
        );

        setShowModal(false);

        setSelectedProduct(
          null
        );

        fetchProducts();

      } catch (err) {

        alert(
          err.response?.data
            ?.message ||
          "Delete Failed"
        );

      }

    };

  const updateProduct =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.put(
            `http://localhost:5000/api/admin/products/${editProduct._id}`,
            editProduct,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          data.message
        );

        setShowEditModal(
          false
        );

        setShowModal(false);

        fetchProducts();

      } catch (err) {

        alert(
          err.response?.data
            ?.message ||
          "Update Failed"
        );

      }

    };

  const addProduct =
    async () => {

      try {

        if (
          !newProduct.image
        ) {

          alert(
            "Please select product image"
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
          newProduct.name
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

        alert(
          data.message
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
        });

        fetchProducts();

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data
            ?.message ||
          "Product Add Failed"
        );

      }

    };

  const filteredProducts =
    products

      .filter((product) => {

        const matchSearch =
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
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

      })

      .sort((a, b) => {

        switch (sortBy) {

          case "az":

            return a.name.localeCompare(
              b.name
            );

          case "za":

            return b.name.localeCompare(
              a.name
            );

          case "priceLow":

            return (
              a.priceValue -
              b.priceValue
            );

          case "priceHigh":

            return (
              b.priceValue -
              a.priceValue
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

      });

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
    Math.ceil(
      filteredProducts.length /
      productsPerPage
    );

  const totalProducts =
    products.length;

  const totalCategories =
    [
      ...new Set(
        products.map(
          (p) => p.category
        )
      ),
    ].length;

  const lowStock =
    products.filter(
      (p) =>
        p.stock <= 5
    ).length;

  const totalStock =
    products.reduce(
      (sum, p) =>
        sum +
        Number(p.stock || 0),
      0
    );

  if (loading) {

    return (

      <AdminLayout>

        <h2>
          Loading Products...
        </h2>

      </AdminLayout>

    );

  }

  if (error) {

    return (

      <AdminLayout>

        <h2>
          {error}
        </h2>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="products-page">

        <h1 className="products-title">

          Products Management

        </h1>

        {/* =========================
            Statistics Cards
        ========================= */}

        <div className="products-stats-grid">

          <div className="stats-card">

            <h3>
              Total Products
            </h3>

            <span>
              {totalProducts}
            </span>

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

        {/* =========================
            Top Bar
        ========================= */}

        <div className="products-top">

          <div className="products-count">

            Products :{" "}

            <span>
              {filteredProducts.length}
            </span>

          </div>

          <div className="products-actions">

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

              {[
                ...new Set(
                  products.map(
                    (p) =>
                      p.category
                  )
                ),
              ].map(
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

        {/* =========================
            Products Table
        ========================= */}

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
                          src={getImageUrl(
                            product.image
                          )}
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
                            product.stock <=
                            5
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

                      <td className="action-buttons">

                        <button
                          className="view-btn"
                          onClick={() => {

                            setSelectedProduct(
                              product
                            );

                            setShowModal(
                              true
                            );

                          }}
                        >
                          <Eye
                            size={18}
                          />
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => {

                            setEditProduct(
                              product
                            );

                            setShowEditModal(
                              true
                            );

                          }}
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
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
                    colSpan="8"
                  >
                    No Products Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            Pagination
        ========================= */}

        <div className="pagination">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          {[
            ...Array(
              totalPages
            ),
          ].map(
            (_, index) => (

              <button
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
                {index + 1}
              </button>

            )
          )}

          <button
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>

        </div>

        {/* =========================
            View Product Modal
        ========================= */}

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
                  src={getImageUrl(
                    selectedProduct.image
                  )}
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
                      Warranty :
                    </strong>{" "}
                    {
                      selectedProduct.warranty
                    }
                  </p>

                  <p>
                    <strong>
                      Delivery :
                    </strong>{" "}
                    {
                      selectedProduct.delivery
                    }
                  </p>

                  <p>
                    <strong>
                      Description :
                    </strong>
                  </p>

                  <p>
                    {
                      selectedProduct.description
                    }
                  </p>

                </div>

              </div>

              <div className="modal-actions">

                <button
                  className="edit-btn"
                  onClick={() => {

                    setEditProduct(
                      selectedProduct
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

        {/* =========================
            Edit Product Modal
        ========================= */}

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

                  <input
                    type="text"
                    placeholder="Name"
                    value={
                      editProduct.name ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        name:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Price"
                    value={
                      editProduct.price ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        price:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Price Value"
                    value={
                      editProduct.priceValue ??
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        priceValue:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={
                      editProduct.category ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Material"
                    value={
                      editProduct.material ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        material:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={
                      editProduct.stock ??
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <textarea
                    rows="5"
                    placeholder="Description"
                    value={
                      editProduct.description ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description:
                          e.target
                            .value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="modal-actions">

                <button
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

        {/* =========================
            Add Product Modal
        ========================= */}

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

                  <input
                    type="text"
                    placeholder="Name"
                    value={
                      newProduct.name
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Price"
                    value={
                      newProduct.price
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Price Value"
                    value={
                      newProduct.priceValue
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        priceValue:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={
                      newProduct.category
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Material"
                    value={
                      newProduct.material
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        material:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={
                      newProduct.stock
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <textarea
                    rows="5"
                    placeholder="Description"
                    value={
                      newProduct.description
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        image:
                          e.target
                            .files?.[0] ||
                          null,
                      })
                    }
                  />

                </div>

              </div>

              <div className="modal-actions">

                <button
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

      </div>

    </AdminLayout>

  );

};

export default Products;