import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaUsers,
  FaShoppingCart,
  FaCalendarCheck,
} from "react-icons/fa";

import { useInView } from "react-intersection-observer";

import "../css/Stats.css";

function Counter({ end, duration = 2000 }) {

  const [count, setCount] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {

    if (!inView) return;

    let start = 0;

    const increment = end / (duration / 20);

    const timer = setInterval(() => {

      start += increment;

      if (start >= end) {

        setCount(end);

        clearInterval(timer);

      } else {

        setCount(Math.floor(start));

      }

    }, 20);

    return () => clearInterval(timer);

  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;

}

function Stats() {

  const [stats, setStats] = useState({

    projects: 0,
    users: 0,
    orders: 0,
    consultations: 0,

  });

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const { data } = await axios.get(
          "http://localhost:5000/api/stats"
        );

        setStats(data.stats);

      }

      catch (error) {

        console.log(error);

      }

    };

    fetchStats();

  }, []);

  return (

    <section className="stats">

      <div className="stats-title">

        <span>OUR ACHIEVEMENTS</span>

        <h2>Numbers That Speak For Our Success</h2>

        <p>
          Over the years we have successfully transformed hundreds of
          residential and commercial spaces with creativity, quality
          craftsmanship and customer satisfaction.
        </p>

      </div>

      <div className="stats-container">

        <div className="stat-card">

          <FaHome className="stat-icon" />

          <h2>
            <Counter end={stats.projects} />+
          </h2>

          <p>Projects Completed</p>

        </div>

        <div className="stat-card">

          <FaUsers className="stat-icon" />

          <h2>
            <Counter end={stats.users} />+
          </h2>

          <p>Registered Clients</p>

        </div>

        <div className="stat-card">

          <FaShoppingCart className="stat-icon" />

          <h2>
            <Counter end={stats.orders} />+
          </h2>

          <p>Orders Placed</p>

        </div>

        <div className="stat-card">

          <FaCalendarCheck className="stat-icon" />

          <h2>
            <Counter end={stats.consultations} />+
          </h2>

          <p>Consultations</p>

        </div>

      </div>

    </section>

  );

}

export default Stats;