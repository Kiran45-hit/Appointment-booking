import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ✅ Pages
import LandingPage from "./pages/LandingPage";

import Home from "./pages/Home";

import Appointments from "./pages/Appointments";

import Login from "./pages/Login";

import Register from "./pages/Register";

function App() {

  // =========================
  // JWT TOKEN
  // =========================

  const token =
    localStorage
      .getItem("token")
      ?.trim();

  // =========================
  // USER ROLE
  // =========================

  const role =
    localStorage
      .getItem("role")
      ?.trim()
      ?.toUpperCase();

  console.log("TOKEN:", token);

  console.log("ROLE:", role);

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        {/* LANDING PAGE */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={

            token

              ? (
                  role?.includes("ADMIN")

                    ? <Navigate to="/appointments" />

                    : <Navigate to="/home" />
                )

              : <Login />
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PATIENT ROUTES
        ========================= */}

        <Route
          path="/home"
          element={

            token
            &&
            role
            &&
            role.includes(
              "PATIENT"
            )

              ? <Home />

              : <Navigate to="/" />
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/appointments"
          element={

            token
            &&
            role
            &&
            role.includes(
              "ADMIN"
            )

              ? <Appointments />

              : <Navigate to="/" />
          }
        />

        {/* =========================
            INVALID ROUTES
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;