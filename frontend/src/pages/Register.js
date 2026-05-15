import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

// ✅ Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    name: "",

    email: "",

    password: "",

    role: "ROLE_PATIENT",
  });

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:8081/auth/register",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.text();

      if (res.ok) {

        toast.success(data);

        setTimeout(() => {

          navigate("/login");

        }, 2000);

      } else {

        toast.error(data);
      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Registration Failed ❌"
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

        <div className="text-center mb-4">

          <h1 className="text-primary fw-bold">
            🏥 Register
          </h1>

          <p>
            Create Smart Clinic Account
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="mb-3">

            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />

          </div>

          {/* EMAIL */}
          <div className="mb-3">

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-3">

            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />

          </div>

          {/* ROLE */}
          <div className="mb-4">

            <select
              className="form-select"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >

              <option value="ROLE_PATIENT">
                Patient
              </option>

              <option value="ROLE_ADMIN">
                Admin / Doctor
              </option>

            </select>

          </div>

          {/* BUTTON */}
          <div className="text-center">

            <button
              className="btn btn-primary btn-lg px-5 rounded-pill"
            >
              Register
            </button>

          </div>

        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-4">

          <button
            className="btn btn-link"
            onClick={() =>
              navigate("/login")
            }
          >
            Already have account? Login
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

export default Register;