import React from "react";
import "../css/Team.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";
import team4 from "../assets/images/team4.jpg";

function Team() {

  const teamMembers = [

    {
      id: 1,
      image: team1,
      name: "Rahul Sharma",
      role: "Lead Interior Designer",
    },

    {
      id: 2,
      image: team2,
      name: "Priya Patel",
      role: "Project Manager",
    },

    {
      id: 3,
      image: team3,
      name: "Amit Mehta",
      role: "3D Visualizer",
    },

    {
      id: 4,
      image: team4,
      name: "Neha Shah",
      role: "Furniture Specialist",
    },

  ];

  return (

    <section className="team">

      <div className="team-title">

        <span>OUR EXPERTS</span>

        <h2>
          Meet Our Professional Team
        </h2>

        <p>
          Creative minds dedicated to transforming your dream interiors
          into reality.
        </p>

      </div>

      <div className="team-container">

        {teamMembers.map((member) => (

          <div
            className="team-card"
            key={member.id}
          >

            <div className="team-image">

              <img
                src={member.image}
                alt={member.name}
              />

              <div className="team-overlay">

                <a href="#">
                  <FaFacebookF />
                </a>

                <a href="#">
                  <FaInstagram />
                </a>

                <a href="#">
                  <FaLinkedinIn />
                </a>

              </div>

            </div>

            <div className="team-content">

              <h3>
                {member.name}
              </h3>

              <p>
                {member.role}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Team;