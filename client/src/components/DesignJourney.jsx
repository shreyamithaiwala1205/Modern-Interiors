import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FaClipboardList,
  FaPencilRuler,
  FaPalette,
  FaTools,
  FaKey,
} from "react-icons/fa";

import "../css/DesignJourney.css";

const STEPS = [
  {
    icon: <FaClipboardList />,
    title: "Free Consultation",
    text: "Share your vision, space and budget with our designers — no obligation, just ideas.",
  },
  {
    icon: <FaPencilRuler />,
    title: "Concept & 3D Design",
    text: "We turn your brief into a personalized concept, visualized in realistic 3D layouts.",
  },
  {
    icon: <FaPalette />,
    title: "Material & Furniture Selection",
    text: "Handpicked premium materials, finishes and furniture curated to match your style.",
  },
  {
    icon: <FaTools />,
    title: "Crafting & Execution",
    text: "Our skilled artisans and project team bring every detail to life with precision.",
  },
  {
    icon: <FaKey />,
    title: "Final Reveal & Handover",
    text: "Step into your beautifully transformed space — designed, delivered, ready to live in.",
  },
];

/* =====================================================
   3D TILT CARD (mouse-tracked perspective + glare)
===================================================== */

function TiltCard({ children, isLeft }) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, {
    stiffness: 150,
    damping: 18,
  });
  const springY = useSpring(mouseY, {
    stiffness: 150,
    damping: 18,
  });

  const rotateX = useTransform(
    springY,
    [0, 1],
    [10, -10]
  );
  const rotateY = useTransform(
    springX,
    [0, 1],
    [-10, 10]
  );

  const glareX = useTransform(
    springX,
    [0, 1],
    ["0%", "100%"]
  );
  const glareY = useTransform(
    springY,
    [0, 1],
    ["0%", "100%"]
  );

  const handleMouseMove = (event) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className="journey-card"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{
        opacity: 0,
        x: isLeft ? -50 : 50,
        rotateY: isLeft ? -25 : 25,
      }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <motion.div
        className="journey-card-glare"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.15), transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

function DesignJourney() {
  return (
    <section className="design-journey-section">

      {/* AMBIENT BACKGROUND */}

      <div className="journey-orb journey-orb-1" />
      <div className="journey-orb journey-orb-2" />
      <div className="journey-orb journey-orb-3" />

      <motion.div
        className="journey-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <span>HOW IT WORKS</span>
        <h2>Our Design Journey</h2>
        <p>
          From first conversation to final reveal —
          here's how we transform your space, step
          by step.
        </p>
      </motion.div>

      <div className="journey-timeline">

        <motion.div
          className="journey-line"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <span className="journey-line-glow" />
        </motion.div>

        {STEPS.map((step, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              className={`journey-step ${
                isLeft ? "left" : "right"
              }`}
              key={step.title}
            >

              <motion.div
                className="journey-icon"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <span className="journey-icon-ring" />
                <span className="journey-icon-orb">
                  {step.icon}
                </span>
                <span className="journey-icon-pulse" />
              </motion.div>

              <TiltCard isLeft={isLeft}>
                <span className="journey-step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </TiltCard>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default DesignJourney;
