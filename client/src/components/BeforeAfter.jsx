import React, { useState } from "react";
import "../css/BeforeAfter.css";

import beforeImg from "../assets/images/before.png";
import afterImg from "../assets/images/after.png";

function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX !== undefined
        ? e.clientX - rect.left
        : e.touches[0].clientX - rect.left;

    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <section className="before-after-section">

      <div className="section-heading">
        <h2>Before & After Transformation</h2>

        <p>
          See how Modern Interiors transforms ordinary spaces into beautiful
          modern interiors.
        </p>
      </div>

      <div
        className="comparison-container"
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMove(e);
        }}
        onTouchMove={handleMove}
      >
        {/* AFTER IMAGE */}
        <img
          src={afterImg}
          alt="After"
          className="comparison-image"
        />

        {/* BEFORE IMAGE */}
        <div
          className="before-image-wrapper"
          style={{
            width: `${sliderPosition}%`,
          }}
        >
          <img
            src={beforeImg}
            alt="Before"
            className="comparison-image"
          />
        </div>

        {/* LABELS */}

        <span className="before-label">
          Before
        </span>

        <span className="after-label">
          After
        </span>

        {/* SLIDER */}

        <div
          className="slider-line"
          style={{
            left: `${sliderPosition}%`,
          }}
        >
          <div className="slider-handle">
            ⇆
          </div>
        </div>
      </div>

    </section>
  );
}

export default BeforeAfter;