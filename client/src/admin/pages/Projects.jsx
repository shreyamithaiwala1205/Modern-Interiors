import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  Trash2,
  Pencil,
  Eye,
  Plus,
  Upload,
  Search,
  ChevronDown,
  Download,
  MapPin,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";

import getImageUrl from "../../utils/imageUrl";

import { useProjectCategories } from "../../context/ProjectCategoryContext";

import "../css/Projects.css";


const API =
  "http://localhost:5000/api/admin/projects";


/* =====================================================
   INDIA CITIES
===================================================== */

const indiaCities = [
  "Ahmedabad",
  "Amritsar",
  "Aurangabad",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Faridabad",
  "Gandhinagar",
  "Ghaziabad",
  "Goa",
  "Gurugram",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Kota",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangaluru",
  "Meerut",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Noida",
  "Patna",
  "Prayagraj",
  "Pune",
  "Rajkot",
  "Ranchi",
  "Surat",
  "Thane",
  "Thiruvananthapuram",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vasai-Virar",
  "Vijayawada",
  "Visakhapatnam",
];


/* =====================================================
   COMPONENT
===================================================== */

const Projects = () => {

  const {
    categories: dbCategories,
  } = useProjectCategories();


  /* =====================================================
     PROJECT DATA
  ===================================================== */

  const [projects, setProjects] =
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
     MODALS
  ===================================================== */

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);


  /* =====================================================
     EDIT
  ===================================================== */

  const [editProject, setEditProject] =
    useState({});

  const [editImage, setEditImage] =
    useState(null);

  const [editImagePreview, setEditImagePreview] =
    useState("");


  /* =====================================================
     ADD PROJECT
  ===================================================== */

  const [newProject, setNewProject] =
    useState({
      title: "",
      category: "",
      location: "",
      year:
        new Date()
          .getFullYear()
          .toString(),
      description: "",
      image: null,
    });


  const [newImagePreview, setNewImagePreview] =
    useState("");


  /* =====================================================
     VALIDATION
  ===================================================== */

  const [validationErrors, setValidationErrors] =
    useState({});


  /* =====================================================
     CATEGORY DROPDOWN
  ===================================================== */

  const [showCategoryDropdown, setShowCategoryDropdown] =
    useState(false);

  const [categorySearch, setCategorySearch] =
    useState("");


  /* =====================================================
     LOCATION DROPDOWN
  ===================================================== */

  const [showLocationDropdown, setShowLocationDropdown] =
    useState(false);

  const [locationSearch, setLocationSearch] =
    useState("");


  /* =====================================================
     CATEGORY REF
  ===================================================== */

  const categoryRef =
    useRef(null);

  const locationRef =
    useRef(null);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const projectsPerPage = 5;


  /* =====================================================
     FETCH PROJECTS
  ===================================================== */

  useEffect(() => {

    fetchProjects();

  }, []);


  const fetchProjects =
    async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem(
            "token"
          );


        const { data } =
          await axios.get(
            API,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setProjects(
          Array.isArray(
            data.projects
          )
            ? data.projects
            : []
        );

      } catch (err) {

        console.error(
          "FETCH PROJECTS ERROR:",
          err
        );

        setError(
          "Failed to load projects"
        );

      } finally {

        setLoading(false);

      }

    };


  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  const categoryOptions =
    useMemo(() => {

      const projectCategories =
        projects
          .map(
            (project) =>
              project.category
          )
          .filter(Boolean);


      const contextCategories =
        (dbCategories || [])
          .map(
            (category) =>
              category.name ||
              category.label ||
              category
          )
          .filter(Boolean);


      return [
        ...new Set(
          [
            ...contextCategories,
            ...projectCategories,
          ]
        ),
      ];

    }, [
      projects,
      dbCategories,
    ]);


  /* =====================================================
     OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          categoryRef.current &&
          !categoryRef.current.contains(
            event.target
          )
        ) {

          setShowCategoryDropdown(
            false
          );

        }


        if (
          locationRef.current &&
          !locationRef.current.contains(
            event.target
          )
        ) {

          setShowLocationDropdown(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /* =====================================================
     RESET ADD FORM
  ===================================================== */

  const resetNewProject =
    () => {

      setNewProject({
        title: "",
        category: "",
        location: "",
        year:
          new Date()
            .getFullYear()
            .toString(),
        description: "",
        image: null,
      });

      setNewImagePreview("");

      setValidationErrors({});

      setCategorySearch("");

      setLocationSearch("");

      setShowCategoryDropdown(
        false
      );

      setShowLocationDropdown(
        false
      );

    };


  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredProjects =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      const result =
        projects.filter(
          (project) => {

            const matchesSearch =
              !query ||
              String(
                project.title || ""
              )
                .toLowerCase()
                .includes(query) ||
              String(
                project.category || ""
              )
                .toLowerCase()
                .includes(query) ||
              String(
                project.location || ""
              )
                .toLowerCase()
                .includes(query) ||
              String(
                project.year || ""
              )
                .toLowerCase()
                .includes(query);


            const matchesCategory =
              categoryFilter ===
                "all"
                ? true
                : String(
                    project.category ||
                      ""
                  )
                    .toLowerCase() ===
                  String(
                    categoryFilter
                  )
                    .toLowerCase();


            return (
              matchesSearch &&
              matchesCategory
            );

          }
        );


      result.sort(
        (a, b) => {

          if (
            sortBy ===
            "az"
          ) {

            return String(
              a.title || ""
            ).localeCompare(
              String(
                b.title || ""
              )
            );

          }


          if (
            sortBy ===
            "za"
          ) {

            return String(
              b.title || ""
            ).localeCompare(
              String(
                a.title || ""
              )
            );

          }


          if (
            sortBy ===
            "oldest"
          ) {

            return (
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
            );

          }


          return (
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
          );

        }
      );


      return result;

    }, [
      projects,
      search,
      categoryFilter,
      sortBy,
    ]);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const indexOfLast =
    currentPage *
    projectsPerPage;


  const indexOfFirst =
    indexOfLast -
    projectsPerPage;


  const currentProjects =
    filteredProjects.slice(
      indexOfFirst,
      indexOfLast
    );


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProjects.length /
          projectsPerPage
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

  const totalProjects =
    projects.length;


  const totalCategories =
    categoryOptions.length;


  const totalLocations =
    new Set(
      projects
        .map(
          (project) =>
            String(
              project.location ||
                ""
            )
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    ).size;


  const thisYear =
    projects.filter(
      (project) =>
        new Date(
          project.createdAt
        ).getFullYear() ===
        new Date().getFullYear()
    ).length;


  /* =====================================================
     CREATE PROJECT VALIDATION
  ===================================================== */

  const validateNewProject =
    () => {

      const errors = {};


      if (
        !newProject.title ||
        !newProject.title.trim()
      ) {

        errors.title =
          "Project title is required.";

      }


      if (
        !newProject.category
      ) {

        errors.category =
          "Please select a category.";

      }


      if (
        !newProject.location
      ) {

        errors.location =
          "Project location is required.";

      }


      if (
        !newProject.year
      ) {

        errors.year =
          "Project year is required.";

      } else if (
        !/^\d{4}$/.test(
          String(
            newProject.year
          )
        )
      ) {

        errors.year =
          "Please enter a valid 4-digit year.";

      }


      if (
        !newProject.description ||
        !newProject.description.trim()
      ) {

        errors.description =
          "Project description is required.";

      }


      if (
        !newProject.image
      ) {

        errors.image =
          "Please select a project image.";

      }


      setValidationErrors(
        errors
      );


      return (
        Object.keys(
          errors
        ).length === 0
      );

    };


  /* =====================================================
     CREATE PROJECT
  ===================================================== */

  const addProject =
    async () => {

      if (
        !validateNewProject()
      ) {

        return;

      }


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        const formData =
          new FormData();


        formData.append(
          "title",
          newProject.title.trim()
        );

        formData.append(
          "category",
          newProject.category
        );

        formData.append(
          "location",
          newProject.location
        );

        formData.append(
          "year",
          String(
            newProject.year
          )
        );

        formData.append(
          "description",
          newProject.description.trim()
        );

        formData.append(
          "image",
          newProject.image
        );


        const { data } =
          await axios.post(
            API,
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
            "Project created successfully"
        );


        setShowAddModal(
          false
        );

        resetNewProject();

        setCurrentPage(
          1
        );

        fetchProjects();

      } catch (err) {

        console.error(
          "CREATE PROJECT ERROR:",
          err
        );

        toast.error(
          err.response?.data
            ?.message ||
            "Project creation failed."
        );

      }

    };


  /* =====================================================
     UPDATE VALIDATION
  ===================================================== */

  const validateEditProject =
    () => {

      if (
        !editProject.title ||
        !String(
          editProject.title
        ).trim()
      ) {

        toast.error(
          "Project title is required."
        );

        return false;

      }


      if (
        !editProject.category
      ) {

        toast.error(
          "Please select a category."
        );

        return false;

      }


      if (
        editProject.year &&
        !/^\d{4}$/.test(
          String(
            editProject.year
          )
        )
      ) {

        toast.error(
          "Please enter a valid 4-digit year."
        );

        return false;

      }


      return true;

    };


  /* =====================================================
     UPDATE PROJECT
  ===================================================== */

  const updateProject =
    async () => {

      if (
        !validateEditProject()
      ) {

        return;

      }


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        const formData =
          new FormData();


        formData.append(
          "title",
          String(
            editProject.title
          ).trim()
        );

        formData.append(
          "category",
          editProject.category ||
            ""
        );

        formData.append(
          "location",
          editProject.location ||
            ""
        );

        formData.append(
          "year",
          editProject.year ||
            ""
        );

        formData.append(
          "description",
          editProject.description ||
            ""
        );


        if (editImage) {

          formData.append(
            "image",
            editImage
          );

        }


        const { data } =
          await axios.put(
            `${API}/${editProject._id}`,
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
            "Project updated successfully"
        );


        setShowEditModal(
          false
        );

        setShowModal(
          false
        );

        setEditImage(
          null
        );

        setEditImagePreview(
          ""
        );

        fetchProjects();

      } catch (err) {

        console.error(
          "UPDATE PROJECT ERROR:",
          err
        );

        toast.error(
          err.response?.data
            ?.message ||
            "Project update failed."
        );

      }

    };


  /* =====================================================
     DELETE PROJECT
  ===================================================== */

  const deleteProject =
    async (id) => {

      if (
        !window.confirm(
          "Delete this project?"
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
            `${API}/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        toast.success(
          data.message ||
            "Project deleted successfully"
        );


        setShowModal(
          false
        );

        setSelectedProject(
          null
        );


        fetchProjects();

      } catch (err) {

        toast.error(
          err.response?.data
            ?.message ||
            "Delete Failed"
        );

      }

    };


  /* =====================================================
     IMAGE SELECT - ADD
  ===================================================== */

  const handleNewImage =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      setNewProject({
        ...newProject,
        image: file,
      });


      setNewImagePreview(
        URL.createObjectURL(
          file
        )
      );


      setValidationErrors(
        (prev) => ({
          ...prev,
          image: "",
        })
      );

    };


  /* =====================================================
     IMAGE SELECT - EDIT
  ===================================================== */

  const handleEditImage =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      setEditImage(
        file
      );


      setEditImagePreview(
        URL.createObjectURL(
          file
        )
      );

    };


  /* =====================================================
     EXPORT ALL PROJECTS
  ===================================================== */

  const exportProjects =
    () => {

      if (
        projects.length === 0
      ) {

        toast.error(
          "No projects available to export."
        );

        return;

      }


      const headers = [
        "No",
        "Title",
        "Category",
        "Location",
        "Year",
        "Description",
        "Created At",
      ];


      const rows =
        projects.map(
          (
            project,
            index
          ) => [

            index + 1,

            project.title || "",

            project.category || "",

            project.location || "",

            project.year || "",

            String(
              project.description ||
                ""
            )
              .replace(
                /"/g,
                '""'
              ),

            project.createdAt
              ? new Date(
                  project.createdAt
                ).toLocaleDateString(
                  "en-IN"
                )
              : "",

          ]
        );


      const csvRows = [
        headers,
        ...rows,
      ]
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value ?? ""
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\n");


      const blob =
        new Blob(
          [csvRows],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;

      link.download =
        `modern-interiors-projects-${new Date()
          .toISOString()
          .split("T")[0]}.csv`;


      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

      toast.success(
        "All projects exported successfully."
      );

    };


  /* =====================================================
     CATEGORY FILTER
  ===================================================== */

  const filteredCategoryOptions =
    categoryOptions.filter(
      (category) =>
        String(
          category
        )
          .toLowerCase()
          .includes(
            categorySearch
              .toLowerCase()
          )
    );


  /* =====================================================
     LOCATION FILTER
  ===================================================== */

  const filteredCities =
    indiaCities.filter(
      (city) =>
        city
          .toLowerCase()
          .includes(
            locationSearch
              .toLowerCase()
          )
    );


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <AdminLayout>

        <h2>
          Loading Projects...
        </h2>

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
     JSX
  ===================================================== */

  return (

    <AdminLayout>

      <div className="products-page">


        {/* ==========================================
            PAGE HEADING
        ========================================== */}

        <div className="projects-heading-row">

          <h1 className="products-title">
            Projects Management
          </h1>


          <button
            type="button"
            className="project-add-btn"
            onClick={() => {

              resetNewProject();

              setShowAddModal(
                true
              );

            }}
          >

            <Plus size={17} />

            <span>
              Add Project
            </span>

          </button>

        </div>


        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="products-stats-grid">


          <div className="stats-card">

            <h3>
              Total Projects :
            </h3>

            <span>
              {totalProjects}
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
              Total Locations
            </h3>

            <span>
              {totalLocations}
            </span>

          </div>


          <div className="stats-card">

            <h3>
              This Year
            </h3>

            <span>
              {thisYear}
            </span>

          </div>

        </div>


        {/* ==========================================
            TOOLBAR
        ========================================== */}

        <div className="projects-toolbar">


          <div className="projects-toolbar-left">

            <div className="products-count">

              Projects :{" "}

              <span>
                {
                  filteredProjects.length
                }
              </span>

            </div>


            <button
              type="button"
              className="project-export-btn"
              onClick={
                exportProjects
              }
            >

              <Download size={16} />

              <span>
                Export CSV
              </span>

            </button>

          </div>


          <div className="projects-toolbar-right">


            <input
              type="text"
              placeholder="Search project..."
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

              {categoryOptions.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>


            <select
              className="filter-box"
              value={
                sortBy
              }
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

            </select>

          </div>

        </div>


        {/* ==========================================
            TABLE
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
                  Title
                </th>

                <th>
                  Category
                </th>

                <th>
                  Location
                </th>

                <th>
                  Year
                </th>

                <th>
                  Created At
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {currentProjects.length >
              0 ? (

                currentProjects.map(
                  (
                    project,
                    index
                  ) => (

                    <tr
                      key={
                        project._id
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
                            project.image
                          )}
                          alt={
                            project.title
                          }
                          className="product-thumb"
                        />

                      </td>


                      <td>

                        <strong>
                          {
                            project.title
                          }
                        </strong>

                      </td>


                      <td>
                        {
                          project.category ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          project.location ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          project.year ||
                          "—"
                        }
                      </td>


                      <td>

                        {
                          project.createdAt
                            ? new Date(
                                project.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day:
                                    "numeric",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )
                            : "—"
                        }

                      </td>


                      <td className="action-buttons">


                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Project"
                          onClick={() => {

                            setSelectedProject(
                              project
                            );

                            setShowModal(
                              true
                            );

                          }}
                        >

                          <Eye
                            size={17}
                          />

                        </button>


                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Project"
                          onClick={() => {

                            setEditProject(
                              {
                                ...project,
                              }
                            );

                            setEditImage(
                              null
                            );

                            setEditImagePreview(
                              getImageUrl(
                                project.image
                              )
                            );

                            setShowEditModal(
                              true
                            );

                          }}
                        >

                          <Pencil
                            size={17}
                          />

                        </button>


                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Project"
                          onClick={() =>
                            deleteProject(
                              project._id
                            )
                          }
                        >

                          <Trash2
                            size={17}
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
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No Projects Found
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
            title="Next Page"
          >
            ›
          </button>

        </div>


        {/* ==========================================
            VIEW PROJECT MODAL
        ========================================== */}

        {showModal &&
          selectedProject && (

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

                <div>

                  <span className="project-modal-eyebrow">
                    PROJECT
                  </span>

                  <h2>
                    Project Details
                  </h2>

                </div>


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
                  src={getImageUrl(
                    selectedProject.image
                  )}
                  alt={
                    selectedProject.title
                  }
                  className="product-preview"
                />


                <div className="product-info">

                  <p>
                    <strong>
                      Title :
                    </strong>{" "}
                    {
                      selectedProject.title
                    }
                  </p>


                  <p>
                    <strong>
                      Category :
                    </strong>{" "}
                    {
                      selectedProject.category ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Location :
                    </strong>{" "}
                    {
                      selectedProject.location ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Year :
                    </strong>{" "}
                    {
                      selectedProject.year ||
                      "-"
                    }
                  </p>


                  <p>
                    <strong>
                      Description :
                    </strong>
                  </p>


                  <p>
                    {
                      selectedProject.description ||
                      "No description available."
                    }
                  </p>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-btn modal-btn-secondary"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Close
                </button>


                <button
                  type="button"
                  className="modal-btn modal-btn-edit"
                  onClick={() => {

                    setEditProject(
                      {
                        ...selectedProject,
                      }
                    );

                    setEditImage(
                      null
                    );

                    setEditImagePreview(
                      getImageUrl(
                        selectedProject.image
                      )
                    );

                    setShowModal(
                      false
                    );

                    setShowEditModal(
                      true
                    );

                  }}
                >

                  <Pencil size={15} />

                  <span>
                    Edit Project
                  </span>

                </button>


                <button
                  type="button"
                  className="modal-btn modal-btn-danger"
                  onClick={() =>
                    deleteProject(
                      selectedProject._id
                    )
                  }
                >

                  <Trash2 size={15} />

                  <span>
                    Delete
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            EDIT PROJECT MODAL
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

                <div>

                  <span className="project-modal-eyebrow">
                    PROJECT
                  </span>

                  <h2>
                    Edit Project
                  </h2>

                </div>


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


                  <label>
                    Project Title *
                  </label>

                  <input
                    type="text"
                    value={
                      editProject.title ||
                      ""
                    }
                    placeholder="Project Title"
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        title:
                          e.target.value,
                      })
                    }
                  />


                  <label>
                    Category *
                  </label>

                  <div
                    className="project-category-picker"
                    ref={
                      categoryRef
                    }
                  >

                    <button
                      type="button"
                      className="project-category-trigger"
                      onClick={() => {

                        setShowCategoryDropdown(
                          !showCategoryDropdown
                        );

                        setCategorySearch(
                          ""
                        );

                      }}
                    >

                      <span
                        className={
                          editProject.category
                            ? "selected-category"
                            : "category-placeholder"
                        }
                      >
                        {
                          editProject.category ||
                          "Select Category"
                        }
                      </span>


                      <ChevronDown
                        size={17}
                      />

                    </button>


                    {showCategoryDropdown && (

                      <div className="project-category-dropdown">

                        <div className="project-category-search">

                          <Search
                            size={16}
                          />

                          <input
                            type="text"
                            placeholder="Search category..."
                            value={
                              categorySearch
                            }
                            onChange={(e) =>
                              setCategorySearch(
                                e.target.value
                              )
                            }
                            autoFocus
                          />

                        </div>


                        <div className="project-category-list">

                          {filteredCategoryOptions.length >
                          0 ? (

                            filteredCategoryOptions.map(
                              (category) => (

                                <button
                                  type="button"
                                  key={category}
                                  className={
                                    `project-category-option ${
                                      editProject.category ===
                                      category
                                        ? "selected"
                                        : ""
                                    }`
                                  }
                                  onClick={() => {

                                    setEditProject({
                                      ...editProject,
                                      category:
                                        category,
                                    });

                                    setShowCategoryDropdown(
                                      false
                                    );

                                  }}
                                >
                                  {category}
                                </button>

                              )
                            )

                          ) : (

                            <div className="project-category-empty">
                              No category found
                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </div>


                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    value={
                      editProject.location ||
                      ""
                    }
                    placeholder="Location"
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        location:
                          e.target.value,
                      })
                    }
                  />


                  <label>
                    Year
                  </label>

                  <input
                    type="text"
                    value={
                      editProject.year ||
                      ""
                    }
                    placeholder="2026"
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        year:
                          e.target.value,
                      })
                    }
                  />


                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    value={
                      editProject.description ||
                      ""
                    }
                    placeholder="Project details..."
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        description:
                          e.target.value,
                      })
                    }
                  />


                  <label>
                    Cover Image
                  </label>


                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleEditImage
                    }
                  />


                  {editImagePreview && (

                    <div className="project-preview-wrapper">

                      <img
                        src={
                          editImagePreview
                        }
                        alt="Project Preview"
                        className="project-image-preview"
                      />

                      <span>
                        Current / selected image
                      </span>

                    </div>

                  )}

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-btn modal-btn-secondary"
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
                  className="modal-btn modal-btn-save"
                  onClick={
                    updateProject
                  }
                >

                  <Pencil
                    size={15}
                  />

                  <span>
                    Save Changes
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            ADD PROJECT MODAL
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
              className="product-modal project-add-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              <div className="modal-header">

                <div>

                  <span className="project-modal-eyebrow">
                    PROJECT
                  </span>

                  <h2>
                    Add Project
                  </h2>

                </div>


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


                  {/* TITLE */}

                  <label>
                    Project Title *
                  </label>

                  <input
                    type="text"
                    placeholder="Project Title"
                    value={
                      newProject.title
                    }
                    className={
                      validationErrors.title
                        ? "project-input-error"
                        : ""
                    }
                    onChange={(e) => {

                      setNewProject({
                        ...newProject,
                        title:
                          e.target.value,
                      });

                      setValidationErrors(
                        (prev) => ({
                          ...prev,
                          title: "",
                        })
                      );

                    }}
                  />

                  {validationErrors.title && (

                    <span className="project-validation-message">
                      {
                        validationErrors.title
                      }
                    </span>

                  )}


                  {/* CATEGORY */}

                  <label>
                    Category *
                  </label>

                  <div
                    className="project-category-picker"
                    ref={
                      categoryRef
                    }
                  >

                    <button
                      type="button"
                      className={
                        `project-category-trigger ${
                          validationErrors.category
                            ? "project-input-error"
                            : ""
                        }`
                      }
                      onClick={() => {

                        setShowCategoryDropdown(
                          !showCategoryDropdown
                        );

                        setCategorySearch(
                          ""
                        );

                      }}
                    >

                      <span
                        className={
                          newProject.category
                            ? "selected-category"
                            : "category-placeholder"
                        }
                      >
                        {
                          newProject.category ||
                          "Select Category"
                        }
                      </span>


                      <ChevronDown
                        size={17}
                      />

                    </button>


                    {showCategoryDropdown && (

                      <div className="project-category-dropdown">

                        <div className="project-category-search">

                          <Search
                            size={16}
                          />

                          <input
                            type="text"
                            placeholder="Search category..."
                            value={
                              categorySearch
                            }
                            onChange={(e) =>
                              setCategorySearch(
                                e.target.value
                              )
                            }
                            autoFocus
                          />

                        </div>


                        <div className="project-category-list">

                          {filteredCategoryOptions.length >
                          0 ? (

                            filteredCategoryOptions.map(
                              (category) => (

                                <button
                                  type="button"
                                  key={category}
                                  className={
                                    `project-category-option ${
                                      newProject.category ===
                                      category
                                        ? "selected"
                                        : ""
                                    }`
                                  }
                                  onClick={() => {

                                    setNewProject({
                                      ...newProject,
                                      category:
                                        category,
                                    });

                                    setShowCategoryDropdown(
                                      false
                                    );

                                    setValidationErrors(
                                      (prev) => ({
                                        ...prev,
                                        category:
                                          "",
                                      })
                                    );

                                  }}
                                >

                                  {category}

                                </button>

                              )
                            )

                          ) : (

                            <div className="project-category-empty">
                              No category found
                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </div>


                  {validationErrors.category && (

                    <span className="project-validation-message">
                      {
                        validationErrors.category
                      }
                    </span>

                  )}


                  {/* LOCATION */}

                  <label>
                    Location *
                  </label>

                  <div
                    className="project-category-picker"
                    ref={
                      locationRef
                    }
                  >

                    <button
                      type="button"
                      className={
                        `project-category-trigger ${
                          validationErrors.location
                            ? "project-input-error"
                            : ""
                        }`
                      }
                      onClick={() => {

                        setShowLocationDropdown(
                          !showLocationDropdown
                        );

                        setLocationSearch(
                          ""
                        );

                        setShowCategoryDropdown(
                          false
                        );

                      }}
                    >

                      <span
                        className={
                          newProject.location
                            ? "selected-category"
                            : "category-placeholder"
                        }
                      >
                        {
                          newProject.location ||
                          "Select City"
                        }
                      </span>


                      <MapPin
                        size={17}
                      />

                    </button>


                    {showLocationDropdown && (

                      <div className="project-category-dropdown">

                        <div className="project-category-search">

                          <Search
                            size={16}
                          />

                          <input
                            type="text"
                            placeholder="Search Indian city..."
                            value={
                              locationSearch
                            }
                            onChange={(e) =>
                              setLocationSearch(
                                e.target.value
                              )
                            }
                            autoFocus
                          />

                        </div>


                        <div className="project-category-list">

                          {filteredCities.length >
                          0 ? (

                            filteredCities.map(
                              (city) => (

                                <button
                                  type="button"
                                  key={city}
                                  className={
                                    `project-category-option ${
                                      newProject.location ===
                                      city
                                        ? "selected"
                                        : ""
                                    }`
                                  }
                                  onClick={() => {

                                    setNewProject({
                                      ...newProject,
                                      location:
                                        city,
                                    });

                                    setShowLocationDropdown(
                                      false
                                    );

                                    setLocationSearch(
                                      ""
                                    );

                                    setValidationErrors(
                                      (prev) => ({
                                        ...prev,
                                        location:
                                          "",
                                      })
                                    );

                                  }}
                                >

                                  {city}

                                </button>

                              )
                            )

                          ) : (

                            <div className="project-category-empty">
                              No city found
                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </div>


                  {validationErrors.location && (

                    <span className="project-validation-message">
                      {
                        validationErrors.location
                      }
                    </span>

                  )}


                  {/* YEAR */}

                  <label>
                    Year *
                  </label>

                  <input
                    type="text"
                    placeholder="2026"
                    value={
                      newProject.year
                    }
                    className={
                      validationErrors.year
                        ? "project-input-error"
                        : ""
                    }
                    onChange={(e) => {

                      setNewProject({
                        ...newProject,
                        year:
                          e.target.value,
                      });

                      setValidationErrors(
                        (prev) => ({
                          ...prev,
                          year: "",
                        })
                      );

                    }}
                  />

                  {validationErrors.year && (

                    <span className="project-validation-message">
                      {
                        validationErrors.year
                      }
                    </span>

                  )}


                  {/* DESCRIPTION */}

                  <label>
                    Description *
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Project details..."
                    value={
                      newProject.description
                    }
                    className={
                      validationErrors.description
                        ? "project-input-error"
                        : ""
                    }
                    onChange={(e) => {

                      setNewProject({
                        ...newProject,
                        description:
                          e.target.value,
                      });

                      setValidationErrors(
                        (prev) => ({
                          ...prev,
                          description:
                            "",
                        })
                      );

                    }}
                  />

                  {validationErrors.description && (

                    <span className="project-validation-message">
                      {
                        validationErrors.description
                      }
                    </span>

                  )}


                  {/* IMAGE */}

                  <label>
                    Cover Image *
                  </label>


                  <label
                    htmlFor="project-image-upload"
                    className={
                      `project-upload-box ${
                        validationErrors.image
                          ? "upload-error"
                          : ""
                      }`
                    }
                  >

                    <Upload
                      size={22}
                    />

                    <span>
                      Choose Project Image
                    </span>

                    <small>
                      JPG, JPEG, PNG or WEBP
                    </small>

                  </label>


                  <input
                    id="project-image-upload"
                    type="file"
                    accept="image/*"
                    className="project-hidden-file"
                    onChange={
                      handleNewImage
                    }
                  />


                  {validationErrors.image && (

                    <span className="project-validation-message">
                      {
                        validationErrors.image
                      }
                    </span>

                  )}


                  {newImagePreview && (

                    <div className="project-preview-wrapper">

                      <img
                        src={
                          newImagePreview
                        }
                        alt="Project Preview"
                        className="project-image-preview"
                      />

                      <span>
                        Selected image preview
                      </span>

                    </div>

                  )}

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-btn modal-btn-secondary"
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
                  className="modal-btn modal-btn-save"
                  onClick={
                    addProject
                  }
                >

                  <Plus
                    size={16}
                  />

                  <span>
                    Create Project
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>

  );

};

export default Projects;