import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

import getImageUrl from "../utils/imageUrl";

import "../css/Gallery.css";

import beforeImg
    from "../assets/images/before.png";

import afterImg
    from "../assets/images/after.png";

function Gallery() {

    const navigate =
        useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [projects, setProjects] =
        useState([]);

    const [category, setCategory] =
        useState("All");

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [stats, setStats] =
        useState({
            projects: 0,
            users: 0,
            orders: 0,
            consultations: 0,
        });

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    useEffect(() => {

        const fetchProjects =
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    const response =
                        await axios.get(
                            "http://localhost:5000/api/projects"
                        );

                    if (
                        response.data?.success
                    ) {

                        setProjects(
                            Array.isArray(
                                response.data.projects
                            )
                                ? response.data.projects
                                : []
                        );

                    } else {

                        setProjects([]);

                    }

                } catch (fetchError) {

                    console.error(
                        "FETCH PROJECTS ERROR:",
                        fetchError
                    );

                    setError(
                        "Unable to load projects."
                    );

                } finally {

                    setLoading(false);

                }

            };

        fetchProjects();

    }, []);

    // =====================================================
    // FETCH STATS
    // =====================================================

    useEffect(() => {

        const fetchStats =
            async () => {

                try {

                    const response =
                        await axios.get(
                            "http://localhost:5000/api/stats"
                        );

                    if (
                        response.data?.success
                    ) {

                        setStats(
                            response.data.stats
                        );

                    }

                } catch (statsError) {

                    console.error(
                        "FETCH STATS ERROR:",
                        statsError
                    );

                }

            };

        fetchStats();

    }, []);

    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories =
        useMemo(() => {

            const uniqueCategories = [
                ...new Set(
                    projects
                        .map(
                            (item) =>
                                item.category
                        )
                        .filter(Boolean)
                ),
            ];

            return [
                "All",
                ...uniqueCategories,
            ];

        }, [projects]);

    // =====================================================
    // FILTER PROJECTS
    // =====================================================

    const filteredProjects =
        useMemo(() => {

            if (
                category === "All"
            ) {

                return projects;

            }

            return projects.filter(
                (item) =>
                    item.category ===
                    category
            );

        }, [
            projects,
            category,
        ]);

    // =====================================================
    // VIEW PROJECT
    // =====================================================

    const openProject =
        (project) => {

            setSelectedProject(
                project
            );

        };

    // =====================================================
    // CLOSE PROJECT
    // =====================================================

    const closeProject =
        () => {

            setSelectedProject(
                null
            );

        };

    return (

        <section className="gallery">

            {/* =================================================
                HERO
            ================================================= */}

            <div className="gallery-heading">

                <h4>
                    OUR PROJECTS
                </h4>

                <h1>
                    Luxury Interior{" "}
                    <span>
                        Gallery
                    </span>
                </h1>

                <p>
                    Explore our collection
                    of premium residential,
                    commercial and luxury
                    interior projects designed
                    with creativity, elegance
                    and perfection.
                </p>

            </div>

            {/* =================================================
                FILTER
            ================================================= */}

            <div className="gallery-filter">

                {categories.map(
                    (cat) => (

                        <button
                            type="button"
                            key={cat}
                            className={
                                category ===
                                cat
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setCategory(
                                    cat
                                )
                            }
                        >
                            {cat}
                        </button>

                    )
                )}

            </div>

            {/* =================================================
                GALLERY
            ================================================= */}

            <div className="gallery-grid">

                {loading ? (

                    <div
                        className="gallery-loading"
                        style={{
                            gridColumn:
                                "1 / -1",
                        }}
                    >

                        <h2>
                            Loading Projects...
                        </h2>

                    </div>

                ) : error ? (

                    <div
                        className="gallery-empty"
                        style={{
                            gridColumn:
                                "1 / -1",
                        }}
                    >

                        <h2>
                            {error}
                        </h2>

                    </div>

                ) : filteredProjects.length ===
                  0 ? (

                    <div
                        className="gallery-empty"
                        style={{
                            gridColumn:
                                "1 / -1",
                        }}
                    >

                        <h2>
                            No Projects Found
                        </h2>

                        <p>
                            New projects
                            will appear here
                            once added from
                            the admin panel.
                        </p>

                    </div>

                ) : (

                    filteredProjects.map(
                        (item) => (

                            <div
                                className="gallery-card"
                                key={
                                    item._id
                                }
                            >

                                <img
                                    src={getImageUrl(
                                        item.image
                                    )}
                                    alt={
                                        item.title ||
                                        "Interior Project"
                                    }
                                    onError={(
                                        event
                                    ) => {
                                        console.error(
                                            "PROJECT IMAGE LOAD FAILED:",
                                            item.image
                                        );

                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                                <div className="gallery-overlay">

                                    <h3>
                                        {
                                            item.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            item.category
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openProject(
                                                item
                                            )
                                        }
                                    >
                                        View Project
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

            {/* =================================================
                BEFORE & AFTER
            ================================================= */}

            <div className="before-after">

                <div className="before-card">

                    <img
                        src={beforeImg}
                        alt="Before Interior"
                    />

                    <span>
                        Before
                    </span>

                </div>

                <div className="before-card">

                    <img
                        src={afterImg}
                        alt="After Interior"
                    />

                    <span>
                        After
                    </span>

                </div>

            </div>

            {/* =================================================
                PROJECT STATS
            ================================================= */}

            <div className="gallery-stats">

                <div className="stat">

                    <h2>
                        {stats.projects}+
                    </h2>

                    <p>
                        Projects Completed
                    </p>

                </div>

                <div className="stat">

                    <h2>
                        {stats.users}+
                    </h2>

                    <p>
                        Registered Clients
                    </p>

                </div>

                <div className="stat">

                    <h2>
                        {stats.orders}+
                    </h2>

                    <p>
                        Orders Placed
                    </p>

                </div>

                <div className="stat">

                    <h2>
                        {stats.consultations}+
                    </h2>

                    <p>
                        Consultations
                    </p>

                </div>

            </div>

            {/* =================================================
                TESTIMONIALS
            ================================================= */}

            <div className="gallery-testimonials">

                <h4>
                    CLIENT TESTIMONIALS
                </h4>

                <h2>
                    What Our Clients Say
                </h2>

                <div className="testimonial-container">

                    <div className="testimonial-card">

                        <p>
                            "Modern Interiors
                            completely transformed
                            our living room.
                            The design exceeded
                            our expectations.
                            Every detail was
                            handled professionally."
                        </p>

                        <h3>
                            Riya Shah
                        </h3>

                        <span>
                            Home Owner
                        </span>

                    </div>

                    <div className="testimonial-card">

                        <p>
                            "Amazing experience
                            from planning to
                            execution.
                            Professional team
                            with modern ideas
                            and timely delivery."
                        </p>

                        <h3>
                            Rahul Patel
                        </h3>

                        <span>
                            Business Owner
                        </span>

                    </div>

                    <div className="testimonial-card">

                        <p>
                            "Excellent quality,
                            premium materials
                            and beautiful
                            finishing.
                            Highly recommended
                            for luxury interiors."
                        </p>

                        <h3>
                            Priya Mehta
                        </h3>

                        <span>
                            Villa Owner
                        </span>

                    </div>

                </div>

            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <div className="gallery-cta">

                <h2>
                    Ready To Transform
                    Your Dream Space?
                </h2>

                <p>
                    Book your consultation
                    today and let our expert
                    designers create a
                    beautiful, luxurious
                    and functional interior
                    specially for you.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/consultation"
                        )
                    }
                >
                    Book Consultation
                </button>

            </div>

            {/* =================================================
                PROJECT DETAILS MODAL
            ================================================= */}

            {selectedProject && (

                <div
                    className="gallery-project-modal-overlay"
                    onClick={
                        closeProject
                    }
                >

                    <div
                        className="gallery-project-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="gallery-project-close"
                            onClick={
                                closeProject
                            }
                        >
                            ×
                        </button>

                        <div className="gallery-project-modal-image">

                            <img
                                src={getImageUrl(
                                    selectedProject.image
                                )}
                                alt={
                                    selectedProject.title
                                }
                            />

                        </div>

                        <div className="gallery-project-modal-content">

                            <span>
                                {
                                    selectedProject.category
                                }
                            </span>

                            <h2>
                                {
                                    selectedProject.title
                                }
                            </h2>

                            <div className="gallery-project-info">

                                <div>

                                    <strong>
                                        Location
                                    </strong>

                                    <p>
                                        {
                                            selectedProject.location ||
                                            "-"
                                        }
                                    </p>

                                </div>

                                <div>

                                    <strong>
                                        Year
                                    </strong>

                                    <p>
                                        {
                                            selectedProject.year ||
                                            "-"
                                        }
                                    </p>

                                </div>

                            </div>

                            <p className="gallery-project-description">

                                {
                                    selectedProject.description ||
                                    "No description available."
                                }

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}

export default Gallery;