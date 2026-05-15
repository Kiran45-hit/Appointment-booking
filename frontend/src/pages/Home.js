import React, {
  useState,
  useEffect
} from "react";

// ✅ Toastify
import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Home() {

  // =========================
  // STATES
  // =========================

  const [doctors, setDoctors] =
    useState([]);

  const [myAppointment, setMyAppointment] =
    useState(null);

  const [form, setForm] = useState({

    name: "",

    email: "",

    doctor: "",

    specialization: "",

    symptoms: "",

    priority: "",

    date: "",

    time: "",
  });

  // =========================
  // FETCH DOCTORS
  // =========================

  const fetchDoctors = async () => {

    try {

      const res = await fetch(
        "http://localhost:8081/auth/doctors"
      );

      const data =
        await res.json();

      setDoctors(data);

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Failed to load doctors ❌"
      );
    }
  };

  // =========================
  // FETCH APPOINTMENT
  // =========================

  const fetchMyAppointment =
    async () => {

    try {

      const res = await fetch(
        "http://localhost:8081/appointments?page=0&size=50"
      );

      const data =
        await res.json();

      if (
        data.data &&
        data.data.length > 0
      ) {

        const latest =
          data.data[
            data.data.length - 1
          ];

        setMyAppointment(latest);
      }

    }

    catch (error) {

      console.log(error);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchDoctors();

    fetchMyAppointment();

    const interval =
      setInterval(() => {

        fetchMyAppointment();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // =========================
  // TIME FORMAT
  // =========================

  const convertTo12Hour = (time) => {

    if (!time) return "";

    let [hours, minutes] =
      time.split(":");

    let suffix =
      hours >= 12
        ? "PM"
        : "AM";

    hours =
      hours % 12 || 12;

    return `${hours}:${minutes} ${suffix}`;
  };

  const convertTo24Hour = (time) => {

    if (!time) return "";

    let [timePart, modifier] =
      time.split(" ");

    let [hours, minutes] =
      timePart.split(":");

    if (
      modifier === "PM"
      &&
      hours !== "12"
    ) {

      hours =
        parseInt(hours, 10) + 12;
    }

    if (
      modifier === "AM"
      &&
      hours === "12"
    ) {

      hours = "00";
    }

    return `${String(hours)
      .padStart(2, "0")}:${minutes}`;
  };

  // =========================
  // AI ANALYSIS
  // =========================

  const analyzeSymptoms = (symptoms) => {

    const lower =
      symptoms.toLowerCase();

    if (
      lower.includes("chest")
      ||
      lower.includes("heart")
      ||
      lower.includes("breathing")
    ) {

      setForm((prev) => ({

        ...prev,

        specialization:
          "Cardiologist",

        priority:
          "Emergency",
      }));
    }

    else if (
      lower.includes("skin")
      ||
      lower.includes("rash")
    ) {

      setForm((prev) => ({

        ...prev,

        specialization:
          "Dermatologist",

        priority:
          "Normal",
      }));
    }

    else {

      setForm((prev) => ({

        ...prev,

        specialization:
          "General Physician",

        priority:
          "Normal",
      }));
    }
  };

  // =========================
  // BOOK APPOINTMENT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:8081/appointments",
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

      if (res.ok) {

        toast.success(
          "Appointment Booked & Email Sent ✅"
        );

        fetchMyAppointment();

        setForm({

          name: "",

          email: "",

          doctor: "",

          specialization: "",

          symptoms: "",

          priority: "",

          date: "",

          time: "",
        });
      }

      else {

        const err =
          await res.json();

        Object.values(err)
          .forEach((msg) => {

            toast.error(msg);
          });
      }

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Backend connection failed ❌"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  return (

    <div
      className="container-fluid min-vh-100 p-4"
      style={{
        background:
          "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >

      {/* NAVBAR */}

      <div className="d-flex justify-content-end mb-4">

        <button
          className="btn btn-danger px-4 py-2"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* HEADER */}

      <div className="text-center mb-5">

        <h1 className="hero-title">
          🧠 AI Smart Clinic
        </h1>

        <p className="hero-subtitle">
          Smart Healthcare Booking &
          AI Powered Appointment System
        </p>

      </div>

      {/* FORM */}

      <div className="card shadow-lg p-5">

        <h2 className="text-primary mb-4">
          Book Appointment
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="row">

            {/* PATIENT NAME */}

            <div className="col-md-4 mb-3">

              <input
                type="text"
                className="form-control"
                placeholder="Patient Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            {/* EMAIL */}

            <div className="col-md-4 mb-3">

              <input
                type="email"
                className="form-control"
                placeholder="Patient Email"
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

            {/* DOCTOR */}

            <div className="col-md-4 mb-3">

              <select
                className="form-select"
                value={form.doctor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    doctor:
                      e.target.value,
                  })
                }
                required
              >

                <option value="">
                  Select Doctor
                </option>

                {
                  doctors.map(
                    (doctor, index) => (

                      <option
                        key={index}
                        value={doctor}
                      >

                        {doctor}

                      </option>
                    )
                  )
                }

              </select>

            </div>

            {/* SPECIALIZATION */}

            <div className="col-md-4 mb-3">

              <input
                type="text"
                className="form-control"
                placeholder="Specialization"
                value={
                  form.specialization
                }
                readOnly
              />

            </div>

            {/* SYMPTOMS */}

            <div className="col-md-6 mb-3">

              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe Symptoms"
                value={form.symptoms}
                onChange={(e) => {

                  setForm({
                    ...form,
                    symptoms:
                      e.target.value,
                  });

                  analyzeSymptoms(
                    e.target.value
                  );
                }}
                required
              />

            </div>

            {/* PRIORITY */}

            <div className="col-md-2 mb-3">

              <input
                type="text"
                className="form-control"
                value={
                  form.priority
                }
                readOnly
              />

            </div>

            {/* DATE */}

            <div className="col-md-3 mb-3">

              <input
                type="date"
                className="form-control"
                value={form.date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    date:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            {/* TIME */}

            <div className="col-md-3 mb-3">

              <input
                type="time"
                className="form-control"
                value={
                  form.time
                    ? convertTo24Hour(
                        form.time
                      )
                    : ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    time:
                      convertTo12Hour(
                        e.target.value
                      ),
                  })
                }
                required
              />

            </div>

          </div>

          <div className="text-center mt-4">

            <button
              className="btn btn-primary btn-lg px-5"
            >
              Book Appointment
            </button>

          </div>

        </form>

      </div>

      {/* APPOINTMENT STATUS */}

      {
        myAppointment && (

          <div className="card shadow-lg p-4 mt-4">

            <h2 className="text-primary mb-4">
              📌 My Appointment Status
            </h2>

            <div className="row">

              <div className="col-md-3 mb-3">

                <div className="border rounded p-3 bg-light">

                  <h5>Doctor</h5>

                  <p className="fw-bold">
                    {myAppointment.doctor}
                  </p>

                </div>

              </div>

              <div className="col-md-3 mb-3">

                <div className="border rounded p-3 bg-light">

                  <h5>Status</h5>

                  <span
                    className="badge bg-primary"
                  >

                    {myAppointment.status}

                  </span>

                </div>

              </div>

              <div className="col-md-3 mb-3">

                <div className="border rounded p-3 bg-light">

                  <h5>Wait Time</h5>

                  <p className="fw-bold">
                    {myAppointment.waitTime} mins
                  </p>

                </div>

              </div>

              <div className="col-md-3 mb-3">

                <div className="border rounded p-3 bg-light">

                  <h5>Priority</h5>

                  <p className="fw-bold">
                    {myAppointment.priority}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )
      }

      {/* TOAST */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </div>
  );
}

export default Home;