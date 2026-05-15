import React, {
  useEffect,
  useState
} from "react";

import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function Appointments() {

  // =========================
  // STATES
  // =========================

  const [appointments, setAppointments] =
    useState([]);

  const [completedAppointments, setCompletedAppointments] =
    useState([]);

  const [historyAppointments, setHistoryAppointments] =
    useState([]);

  const [filteredAppointments, setFilteredAppointments] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [page, setPage] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [doctor, setDoctor] =
    useState("");

  const [date, setDate] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  // =========================
  // FETCH DOCTORS
  // =========================

  const fetchDoctors =
    async () => {

    try {

      const res =
        await fetch(
          "http://localhost:8081/auth/doctors"
        );

      const data =
        await res.json();

      setDoctors(data);

    }

    catch (error) {

      toast.error(
        "Failed to fetch doctors ❌"
      );
    }
  };

  // =========================
  // FETCH ACTIVE
  // =========================

  const fetchAppointments =
    async () => {

    try {

      setLoading(true);

      const res =
        await fetch(
          "http://localhost:8081/appointments?page=0&size=100&sortBy=id&direction=desc"
        );

      const data =
        await res.json();

      console.log(
        "Fetched appointments:",
        data
      );

      const activeData =
        data.data || [];

      setAppointments(activeData);

      setFilteredAppointments(
        activeData
      );

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch appointments ❌"
      );
    }

    finally {

      setLoading(false);
    }
  };

  // =========================
  // FETCH COMPLETED
  // =========================

  const fetchCompleted =
    async () => {

    try {

      const res =
        await fetch(
          "http://localhost:8081/appointments/completed"
        );

      const data =
        await res.json();

      setCompletedAppointments(
        data
      );

    }

    catch (error) {

      toast.error(
        "Failed to fetch completed appointments ❌"
      );
    }
  };

  // =========================
  // FETCH HISTORY
  // =========================

  const fetchHistory =
    async () => {

    try {

      const res =
        await fetch(
          "http://localhost:8081/appointments/history"
        );

      const data =
        await res.json();

      setHistoryAppointments(
        data
      );

    }

    catch (error) {

      toast.error(
        "Failed to fetch history ❌"
      );
    }
  };

  // =========================
  // FILTER LOGIC
  // =========================

  useEffect(() => {

    let filtered =
      [...appointments];

    if (search.trim() !== "") {

      filtered =
        filtered.filter((a) =>

          a.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
    }

    if (doctor !== "") {

      filtered =
        filtered.filter((a) =>

          a.doctor === doctor
        );
    }

    if (date !== "") {

      filtered =
        filtered.filter((a) =>

          a.date === date
        );
    }

    setFilteredAppointments(
      filtered
    );

  }, [search, doctor, date, appointments]);

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchAppointments();

    fetchCompleted();

    fetchDoctors();

    fetchHistory();

  }, []);

  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (id) => {

    try {

      const res = await fetch(

        `http://localhost:8081/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {

        toast.success(
          "Appointment moved to history ✅"
        );

        fetchAppointments();

        fetchCompleted();

        fetchHistory();

      }

      else {

        toast.error(
          "Delete Failed ❌"
        );
      }

    }

    catch (error) {

      toast.error(
        "Delete Error ❌"
      );
    }
  };

  // =========================
  // COMPLETE
  // =========================

  const handleComplete =
    async (id) => {

    try {

      const res = await fetch(

        `http://localhost:8081/appointments/complete/${id}`,
        {
          method: "PUT",
        }
      );

      if (res.ok) {

        toast.success(
          "Appointment completed ✅"
        );

        fetchAppointments();

        fetchCompleted();

        fetchHistory();
      }

      else {

        toast.error(
          "Completion Failed ❌"
        );
      }

    }

    catch (error) {

      toast.error(
        "Completion Error ❌"
      );
    }
  };

  // =========================
  // EXPORT PDF
  // =========================

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.text(
      "Appointment Report",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[
        "Patient",
        "Doctor",
        "Priority",
        "Date",
        "Time"
      ]],

      body:

        filteredAppointments.map(
          (a) => [

            a.name,
            a.doctor,
            a.priority,
            a.date,
            a.time
          ]
        )
    });

    doc.save(
      "appointments.pdf"
    );

    toast.success(
      "PDF Downloaded ✅"
    );
  };

  // =========================
  // RESET FILTERS
  // =========================

  const resetFilters = () => {

    setSearch("");

    setDoctor("");

    setDate("");

    setPage(0);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  // =========================
  // ANALYTICS
  // =========================

  const totalAppointments =

    appointments.length
    +
    completedAppointments.length
    +
    historyAppointments.length;

  const analyticsData = [

    {
      name: "Active",
      value:
        appointments.length
    },

    {
      name: "Completed",
      value:
        completedAppointments.length
    },

    {
      name: "Deleted",
      value:
        historyAppointments.length
    }
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FF8042"
  ];

  // =========================
  // PAGINATION
  // =========================

  const itemsPerPage = 5;

  const startIndex =
    page * itemsPerPage;

  const paginatedAppointments =
    filteredAppointments.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const totalPages =
    Math.ceil(
      filteredAppointments.length
      / itemsPerPage
    );

  return (

    <div
      className="container-fluid min-vh-100 p-5"
      style={{
        background: darkMode

          ? "#121212"

          : "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="fw-bold text-white">
            📋 Appointments Dashboard
          </h1>

          <p className="text-white">
            Smart Clinic Management System
          </p>

        </div>

        <div>

          <button
            className="btn btn-success btn-lg rounded-pill px-4 me-3"
            onClick={exportPDF}
          >
            📄 Export PDF
          </button>

          <button
            className="btn btn-dark btn-lg rounded-pill px-4 me-3"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            {
              darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"
            }

          </button>

          <button
            className="btn btn-danger btn-lg rounded-pill px-4"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 text-center p-4">
            <h3>📋 Total</h3>
            <h1>{totalAppointments}</h1>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 text-center p-4">
            <h3>🟢 Active</h3>
            <h1>{appointments.length}</h1>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 text-center p-4">
            <h3>✅ Completed</h3>
            <h1>{completedAppointments.length}</h1>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 text-center p-4">
            <h3>🗑 Deleted</h3>
            <h1>{historyAppointments.length}</h1>
          </div>
        </div>

      </div>

      {/* CHART */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">

        <h3 className="mb-4 text-center">
          📊 Appointment Analytics
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={analyticsData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >

              {
                analyticsData.map(
                  (entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  )
                )
              }

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* FILTERS */}

      <div className="card shadow border-0 p-4 mb-4 rounded-4">

        <div className="row g-3">

          <div className="col-md-4">

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="🔍 Search Patient"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-3">

            <select
              className="form-select form-select-lg"
              value={doctor}
              onChange={(e) =>
                setDoctor(
                  e.target.value
                )
              }
            >

              <option value="">
                🩺 Filter Doctor
              </option>

              {
                doctors.map(
                  (doc, index) => (

                    <option
                      key={index}
                      value={doc}
                    >

                      {doc}

                    </option>
                  )
                )
              }

            </select>

          </div>

          <div className="col-md-3">

            <input
              type="date"
              className="form-control form-control-lg"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-2">

            <button
              className="btn btn-secondary btn-lg w-100"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>

        </div>

      </div>

      {/* ACTIVE */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">

        <h2 className="text-primary fw-bold mb-4">
          📋 Active Appointments
        </h2>

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>

                <th>Patient</th>
                <th>Doctor</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                paginatedAppointments.length > 0

                  ?

                  paginatedAppointments.map((a) => (

                    <tr key={a.id}>

                      <td>{a.name}</td>
                      <td>{a.doctor}</td>
                      <td>{a.priority}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>

                      <td>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              handleComplete(a.id)
                            }
                          >
                            Complete
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(a.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))

                  :

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center"
                    >

                      No appointments found

                    </td>

                  </tr>
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* COMPLETED */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">

        <h2 className="text-success fw-bold mb-4">
          ✅ Completed Appointments
        </h2>

        <div className="table-responsive">

          <table className="table table-hover">

            <thead className="table-dark">

              <tr>

                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {
                completedAppointments.length > 0

                  ?

                  completedAppointments.map((a) => (

                    <tr key={a.id}>

                      <td>{a.name}</td>
                      <td>{a.doctor}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.status}</td>

                    </tr>
                  ))

                  :

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center"
                    >

                      No completed appointments

                    </td>

                  </tr>
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* HISTORY */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">

        <h2 className="text-danger fw-bold mb-4">
          🗑 Deleted Appointment History
        </h2>

        <div className="table-responsive">

          <table className="table table-hover">

            <thead className="table-dark">

              <tr>

                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {
                historyAppointments.length > 0

                  ?

                  historyAppointments.map((a) => (

                    <tr key={a.id}>

                      <td>{a.name}</td>
                      <td>{a.doctor}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.status}</td>

                    </tr>
                  ))

                  :

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center"
                    >

                      No deleted appointments

                    </td>

                  </tr>
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Prev
        </button>

        <span className="fw-bold text-white">

          Page {page + 1} of {totalPages}

        </span>

        <button
          className="btn btn-secondary"
          disabled={page + 1 >= totalPages}
          onClick={() =>
            setPage(page + 1)
          }
        >
          Next
        </button>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </div>
  );
}

export default Appointments;