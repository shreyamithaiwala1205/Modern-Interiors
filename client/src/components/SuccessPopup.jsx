import React, { useEffect } from "react";
import "../css/SuccessPopup.css";

function SuccessPopup({ show, onClose }) {

  useEffect(() => {

    if (show) {

      const timer = setTimeout(() => {

        onClose();

      }, 2000);

      return () => clearTimeout(timer);

    }

  }, [show, onClose]);

  if (!show) return null;

  return (

    <div className="success-overlay">

      <div className="success-popup">

        <div className="success-icon">

          ✓

        </div>

        <h2>

          Consultation Booked!

        </h2>

        <p>

          Thank you for choosing us.

        </p>

        <p>

          Our Interior Designer will contact you
          within <strong>24 Hours</strong>.

        </p>

      </div>

    </div>

  );

}

export default SuccessPopup;