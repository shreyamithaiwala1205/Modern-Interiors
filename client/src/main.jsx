import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster, ToastBar, toast } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 35,
          zIndex: 999999,
        }}
        toastOptions={{
          className: "modern-toast",
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "15px",
            fontWeight: "600",
            boxShadow:
              "0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 8px 20px rgba(0, 0, 0, 0.35)",
            maxWidth: "520px",
            border: "1px solid #e2e8f0",
          },
          success: {
            duration: 3800,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
            style: {
              background: "#ffffff",
              color: "#0f172a",
              borderLeft: "6px solid #10b981",
              borderTop: "1px solid #e2e8f0",
              borderRight: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
              boxShadow:
                "0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(16, 185, 129, 0.25)",
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "#ffffff",
              color: "#0f172a",
              borderLeft: "6px solid #ef4444",
              borderTop: "1px solid #e2e8f0",
              borderRight: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
              boxShadow:
                "0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(239, 68, 68, 0.25)",
            },
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <div style={{ flex: "1 1 auto", margin: "0 6px" }}>
                  {message}
                </div>
                <button
                  type="button"
                  className="toast-close-btn"
                  onClick={() => toast.dismiss(t.id)}
                  title="Close notification"
                  aria-label="Close"
                >
                  ✕
                </button>
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <App />
    </>
  </React.StrictMode>
);