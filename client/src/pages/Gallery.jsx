import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import axios from "axios";
import { motion } from "framer-motion";

import getImageUrl from "../utils/imageUrl";
import { useProjectCategories } from "../context/ProjectCategoryContext";
import ReviewsSection from "../components/ReviewsSection";

import "../css/Gallery.css";

import beforeImg from "../assets/images/before.png";
import afterImg from "../assets/images/after.png";

function Gallery() {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const { categories: dbCategories, normalizeCategory } = useProjectCategories();

    // =====================================================
    // STATES
    // =====================================================

    const [projects, setProjects] = useState([]);
    const [category, setCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [stats, setStats] = useState({
        projects: 0,
        users: 0,
        orders: 0,
        consultations: 0,
    });

    const [projectReviews, setProjectReviews] = useState([]);

    // Synchronize category with URL search param
    useEffect(() => {
        if (categoryParam) {
            const norm = normalizeCategory(categoryParam);
            setCategory(norm);
        } else {
            setCategory("All");
        }
    }, [categoryParam, normalizeCategory]);

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    "http://localhost:5000/api/projects"
                );

                if (response.data?.success) {
                    setProjects(
                        Array.isArray(response.data.projects)
                            ? response.data.projects
                            : []
                    );
                } else {
                    setProjects([]);
                }
            } catch (fetchError) {
                console.error("FETCH PROJECTS ERROR:", fetchError);
                setError("Unable to load projects.");
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
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/stats"
                );

                if (response.data?.success) {
                    setStats(response.data.stats);
                }
            } catch (statsError) {
                console.error("FETCH STATS ERROR:", statsError);
            }
        };

        fetchStats();
    }, []);

    // =====================================================
    // FETCH CLIENT REVIEWS (PROJECT-WISE)
    // =====================================================

    useEffect(() => {
        const fetchProjectReviews = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/reviews/featured?targetType=Project&limit=6"
                );

                if (response.data?.success) {
                    setProjectReviews(response.data.reviews || []);
                }
            } catch (reviewsError) {
                console.error("FETCH PROJECT REVIEWS ERROR:", reviewsError);
            }
        };

        fetchProjectReviews();
    }, []);

    // =====================================================
    // CATEGORIES (STANDARDIZED PROJECT CATEGORIES)
    // =====================================================

    const categories = useMemo(() => {
        return [
            { value: "All", label: "All Projects" },
            ...dbCategories.map((c) => ({
                value: c.name,
                label: c.label || c.name,
            })),
        ];
    }, [dbCategories]);

    // =====================================================
    // FILTER PROJECTS
    // =====================================================

    const filteredProjects = useMemo(() => {
        if (category === "All") {
            return projects;
        }

        return projects.filter((item) => {
            const itemNorm = normalizeCategory(item.category);
            return itemNorm.toLowerCase() === category.toLowerCase();
        });
    }, [projects, category, normalizeCategory]);

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

    // =====================================================
    // SCROLL REVEAL ANIMATION
    // =====================================================

    const reveal = (index = 0) => ({
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: {
            duration: 0.6,
            delay: Math.min(index * 0.08, 0.4),
        },
    });

    return (

        <section className="gallery">

            {/* =================================================
                HERO
            ================================================= */}

            <motion.div
                className="gallery-heading"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >

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

            </motion.div>

            {/* =================================================
                FILTER
            ================================================= */}

            <div className="gallery-filter">
                {categories.map((cat) => (
                    <button
                        type="button"
                        key={cat.value}
                        className={category === cat.value ? "active" : ""}
                        onClick={() => {
                            setCategory(cat.value);
                            if (cat.value === "All") {
                                setSearchParams({});
                            } else {
                                setSearchParams({ category: cat.value });
                            }
                        }}
                    >
                        {cat.label || cat.value}
                    </button>
                ))}
            </div>

            {/* =================================================
                GALLERY
            ================================================= */}

            {loading ? (

                <div className="gallery-status">
                    <h2>
                        Loading Projects...
                    </h2>
                </div>

            ) : error ? (

                <div className="gallery-status">
                    <h2>
                        {error}
                    </h2>
                </div>

            ) : filteredProjects.length === 0 ? (

                <div className="gallery-status">
                    <h2>
                        No Projects Found
                    </h2>

                    <p>
                        New projects will
                        appear here once
                        added from the
                        admin panel.
                    </p>
                </div>

            ) : filteredProjects.length <= 2 ? (

                /* =========================================
                    SPOTLIGHT LAYOUT (1-2 RESULTS)
                    A wide editorial feature instead of a
                    grid card floating alone in empty space.
                ========================================= */

                <div className="gallery-spotlight">

                    {filteredProjects.map(
                        (item, index) => (

                            <motion.div
                                className="spotlight-card"
                                key={item._id}
                                {...reveal(index)}
                            >

                                <div className="spotlight-image">

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
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                                <div className="spotlight-content">

                                    <span className="spotlight-category">
                                        {
                                            item.category ||
                                            "Interior Project"
                                        }
                                    </span>

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p className="spotlight-description">
                                        {item.description ||
                                            "A thoughtfully designed space crafted by our team, blending function and elegance."}
                                    </p>

                                    <div className="spotlight-meta">

                                        <div>
                                            <strong>
                                                Location
                                            </strong>
                                            <span>
                                                {item.location ||
                                                    "-"}
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                Year
                                            </strong>
                                            <span>
                                                {item.year ||
                                                    "-"}
                                            </span>
                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openProject(item)
                                        }
                                    >
                                        View Full Project
                                    </button>

                                </div>

                            </motion.div>

                        )
                    )}

                </div>

            ) : (

                <div className="gallery-grid">

                    {filteredProjects.map(
                        (item, index) => (

                            <motion.div
                                className="gallery-card"
                                key={
                                    item._id
                                }
                                {...reveal(index)}
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

                            </motion.div>

                        )
                    )}

                </div>

            )}

            {/* =================================================
                BEFORE & AFTER
            ================================================= */}

            <div className="before-after">

                <motion.div
                    className="before-card"
                    {...reveal(0)}
                >

                    <img
                        src={beforeImg}
                        alt="Before Interior"
                    />

                    <span>
                        Before
                    </span>

                </motion.div>

                <motion.div
                    className="before-card"
                    {...reveal(1)}
                >

                    <img
                        src={afterImg}
                        alt="After Interior"
                    />

                    <span>
                        After
                    </span>

                </motion.div>

            </div>

            {/* =================================================
                PROJECT STATS
            ================================================= */}

            <div className="gallery-stats">

                <motion.div className="stat" {...reveal(0)}>

                    <h2>
                        {stats.projects}+
                    </h2>

                    <p>
                        Projects Completed
                    </p>

                </motion.div>

                <motion.div className="stat" {...reveal(1)}>

                    <h2>
                        {stats.users}+
                    </h2>

                    <p>
                        Registered Clients
                    </p>

                </motion.div>

                <motion.div className="stat" {...reveal(2)}>

                    <h2>
                        {stats.orders}+
                    </h2>

                    <p>
                        Orders Placed
                    </p>

                </motion.div>

                <motion.div className="stat" {...reveal(3)}>

                    <h2>
                        {stats.consultations}+
                    </h2>

                    <p>
                        Consultations
                    </p>

                </motion.div>

            </div>

            {/* =================================================
                TESTIMONIALS
            ================================================= */}

            {projectReviews.length > 0 && (

                <div className="gallery-testimonials">

                    <h4>
                        CLIENT TESTIMONIALS
                    </h4>

                    <h2>
                        What Our Clients Say
                    </h2>

                    <div className="testimonial-container">

                        {projectReviews.map((review, index) => (

                            <motion.div
                                className="testimonial-card"
                                key={review._id}
                                {...reveal(index)}
                            >

                                <p>
                                    "{review.comment}"
                                </p>

                                <h3>
                                    {review.user?.name || "Happy Client"}
                                </h3>

                                <span>
                                    {review.target?.title || "Client"}
                                </span>

                            </motion.div>

                        ))}

                    </div>

                </div>

            )}

            {/* =================================================
                CTA
            ================================================= */}

            <motion.div className="gallery-cta" {...reveal(0)}>

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

            </motion.div>

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

                            <ReviewsSection
                                targetType="Project"
                                targetId={selectedProject._id}
                            />

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}

export default Gallery;