import React from "react";
import "../css/Projects.css";

import project1 from "../assets/images/project1.jpg";
import project2 from "../assets/images/project2.jpg";
import project3 from "../assets/images/project3.jpg";

const projects = [
  {
    image: project1,
    title: "Luxury Living Room",
    category: "Residential"
  },
  {
    image: project2,
    title: "Modern Bedroom",
    category: "Interior Design"
  },
  {
    image: project3,
    title: "Premium Kitchen",
    category: "Modular Kitchen"
  }
];

function Projects() {
  return (
    <section className="projects">

      <div className="section-heading">

        <span>OUR PROJECTS</span>

        <h2>Featured Interior Designs</h2>

        <p>
          Explore our latest premium interior projects designed with
          elegance, creativity and attention to every detail.
        </p>

      </div>

      <div className="project-grid">

        {projects.map((project, index) => (

          <div className="project-card" key={index}>

            <img src={project.image} alt={project.title} />

            <div className="overlay">

              <h3>{project.title}</h3>

              <p>{project.category}</p>

              <button>
                View Project
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Projects;