import React from "react";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        gap: "16px",
        color: "#d4af37",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          border: "3px solid rgba(212, 175, 55, 0.2)",
          borderTop: "3px solid #d4af37",
          borderRadius: "50%",
          animation: "spinLoader 0.9s linear infinite",
        }}
      />
      <style>{`
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: "14px", letterSpacing: "1px", color: "#bbb" }}>
        Loading...
      </span>
    </div>
  );
}

export default Loader;
