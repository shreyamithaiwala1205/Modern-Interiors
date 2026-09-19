import React, { useEffect, useState } from "react";
import axios from "axios";

import Hero from "../components/Hero";
import Services from "../components/Services";
import TrendingProducts from "../components/TrendingProducts";
import DesignJourney from "../components/DesignJourney";
import Projects from "../components/Projects";
import BeforeAfter from "../components/BeforeAfter";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";

function Home() {

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/home-settings"
        );

        if (data?.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error(
          "FETCH HOME SETTINGS ERROR:",
          error
        );
      }
    };

    fetchSettings();
  }, []);

  const isEnabled = (key) =>
    !settings || settings[key] !== false;

  return (
    <>
      <Hero />
      {isEnabled("services") && <Services />}
      {isEnabled("trendingProducts") && (
        <TrendingProducts />
      )}
      {isEnabled("designJourney") && (
        <DesignJourney />
      )}
      {isEnabled("projects") && <Projects />}
      {isEnabled("beforeAfter") && <BeforeAfter />}
      {isEnabled("whyChoose") && <WhyChoose />}
      {isEnabled("stats") && <Stats />}
      {isEnabled("team") && <Team />}
      {isEnabled("testimonials") && (
        <Testimonials />
      )}
    </>
  );
}

export default Home;
