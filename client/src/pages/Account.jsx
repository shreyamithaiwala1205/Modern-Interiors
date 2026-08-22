import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../css/Account.css";

function Account() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="account-page">

      <div className="account-container">

        {/* Toggle Buttons */}

        <div className="toggle-box">

          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>

        </div>

        {/* Form */}

        <div className="form-box">

          {isLogin ? (
            <Login changeForm={() => setIsLogin(false)} />
          ) : (
            <Register changeForm={() => setIsLogin(true)} />
          )}

        </div>

      </div>

    </section>
  );
}

export default Account;