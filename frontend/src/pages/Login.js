import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

// ✅ Toastify
import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Login() {

  const navigate = useNavigate();

  // =========================
  // FORM STATE
  // =========================

  const [form, setForm] = useState({

    email: "",

    password: "",
  });

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:8081/auth/login",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(form),
        }
      );

      const data =
        await res.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // =========================
      // SUCCESS
      // =========================

      if (res.ok) {

        // ✅ CLEAR OLD SESSION

        localStorage.clear();

        // ✅ SAVE TOKEN

        localStorage.setItem(
          "token",
          data.token
        );

        // ✅ SAVE ROLE

        localStorage.setItem(
          "role",
          data.role?.trim()
        );

        toast.success(
          "Login Successful ✅"
        );

        // =========================
        // ROLE BASED REDIRECT
        // =========================

        setTimeout(() => {

          const role =
            data.role
              ?.trim()
              ?.toUpperCase();

          console.log(
            "ROLE AFTER LOGIN:",
            role
          );

          // ✅ ADMIN

          if (
            role
            &&
            role.includes(
              "ADMIN"
            )
          ) {

            window.location.href =
              "/appointments";
          }

          // ✅ PATIENT

          else if (
            role
            &&
            role.includes(
              "PATIENT"
            )
          ) {

            window.location.href =
              "/home";
          }

          // ❌ UNKNOWN ROLE

          else {

            toast.error(
              "Invalid role detected ❌"
            );
          }

        }, 1500);

      }

      // =========================
      // FAILED LOGIN
      // =========================

      else {

        toast.error(

          data.message
          ||
          "Invalid Credentials ❌"
        );
      }

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Backend connection failed ❌"
      );
    }
  };

  return (

    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background:
          "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >

      <div
        className="card shadow-lg border-0 p-5"
        style={{
          width: "450px",
          borderRadius: "25px",
        }}
      >

        {/* HEADER */}

        <div className="text-center mb-4">

          <h1 className="text-primary fw-bold">
            🔐 Login
          </h1>

          <p className="text-muted">
            Smart Clinic Authentication
          </p>

        </div>

        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="mb-3">

            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-4">

            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              required
            />

          </div>

          {/* LOGIN BUTTON */}

          <div className="text-center">

            <button
              className="btn btn-primary btn-lg px-5"
            >
              Login
            </button>

          </div>

        </form>

        {/* REGISTER BUTTON */}

        <div className="text-center mt-4">

          <button
            className="btn btn-link"
            onClick={() =>
              navigate("/register")
            }
          >
            New user? Register
          </button>

        </div>

      </div>

      {/* TOAST */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </div>
  );
}

export default Login;