import React from "react";

import { useNavigate } from "react-router-dom";

function LandingPage() {

  const navigate = useNavigate();

  return (

    <div
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background:
          "linear-gradient(135deg, #4facfe, #00f2fe)",
        padding: "40px",
      }}
    >

      {/* =========================
          HERO SECTION
      ========================= */}

      <div className="text-center mb-5">

        <h1
          className="hero-title mb-4"
        >
          🧠 AI Smart Clinic
          <br />
          Management System
        </h1>

        <p className="hero-subtitle mb-5">

          Smart Healthcare Booking,
          AI-powered Symptom Analysis,
          Emergency Prioritization
          & Intelligent Appointment Management

        </p>

        {/* BUTTONS */}

        <div className="d-flex gap-4 justify-content-center flex-wrap">

          <button
            className="btn btn-light btn-lg px-5 py-3"
            onClick={() =>
              navigate("/login")
            }
          >
            🔐 Login
          </button>

          <button
            className="btn btn-dark btn-lg px-5 py-3"
            onClick={() =>
              navigate("/register")
            }
          >
            📝 Register
          </button>

        </div>

      </div>

      {/* =========================
          FEATURE CARDS
      ========================= */}

      <div className="row w-100 mt-4">

        {/* FEATURE 1 */}

        <div className="col-md-4 mb-4">

          <div className="card shadow-lg p-4 h-100 text-center">

            <div
              style={{
                fontSize: "4rem",
              }}
            >
              🤖
            </div>

            <h3 className="mt-3">
              AI Assistance
            </h3>

            <p className="mt-2">

              Smart symptom analysis
              predicts doctor specialization
              and emergency priority.

            </p>

          </div>

        </div>

        {/* FEATURE 2 */}

        <div className="col-md-4 mb-4">

          <div className="card shadow-lg p-4 h-100 text-center">

            <div
              style={{
                fontSize: "4rem",
              }}
            >
              📅
            </div>

            <h3 className="mt-3">
              Smart Booking
            </h3>

            <p className="mt-2">

              Intelligent appointment
              scheduling with duplicate
              prevention and slot handling.

            </p>

          </div>

        </div>

        {/* FEATURE 3 */}

        <div className="col-md-4 mb-4">

          <div className="card shadow-lg p-4 h-100 text-center">

            <div
              style={{
                fontSize: "4rem",
              }}
            >
              🚨
            </div>

            <h3 className="mt-3">
              Emergency Priority
            </h3>

            <p className="mt-2">

              Emergency patients are
              automatically identified
              and prioritized instantly.

            </p>

          </div>

        </div>

      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="mt-5 text-center text-white">

        <p>
          © 2026 AI Smart Clinic Management System
        </p>

      </div>

    </div>
  );
}

export default LandingPage;