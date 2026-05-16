import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    doctor: "",
    specialization: "",
    specializationId: "",
    date: "",
    time: "",
    symptoms: "",
    priority: "",
  });

  const fetchSpecializations = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/specializations");
      const data = await res.json();
      setSpecializations(data);
    } catch (error) {
      toast.error("Failed to load specializations ❌");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors ❌");
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:8081/appointments?page=0&size=100&sortBy=id&direction=desc`);
      const data = await res.json();
      const all = data.data || data || [];
      const email = localStorage.getItem("email");
      if (email) {
        setMyAppointments(all.filter((a) => a.email === email));
      } else {
        setMyAppointments(all);
      }
    } catch (error) {
      toast.error("Failed to load appointments ❌");
    }
  };

  useEffect(() => {
    fetchSpecializations();
    fetchDoctors();
    fetchMyAppointments();
  }, []);

  const handleSpecializationChange = (e) => {
    const selectedId = e.target.value;
    const selectedSpec = specializations.find((s) => s.id === parseInt(selectedId));
    setForm({ ...form, specializationId: selectedId, specialization: selectedSpec ? selectedSpec.name : "", doctor: "" });
    if (selectedId) {
      setFilteredDoctors(doctors.filter((d) => d.specialization && d.specialization.id === parseInt(selectedId)));
    } else {
      setFilteredDoctors([]);
    }
  };

  const handleDoctorChange = (e) => {
    setForm({ ...form, doctor: e.target.value });
  };

  // =========================
  // AI SUGGEST SPECIALIZATION
  // =========================
  const handleAiSuggest = async () => {
    if (!form.symptoms.trim()) {
      toast.warning("Please enter your symptoms first! ⚠️");
      return;
    }
    setAiLoading(true);
    setAiSuggestion(null);

    const specializationList = specializations.map((s) => `${s.name}: ${s.description || ""}`).join("\n");

    const prompt = `You are a medical assistant helping patients find the right doctor specialization.

Available specializations:
${specializationList}

Patient symptoms: "${form.symptoms}"

Based on the symptoms, suggest the most appropriate specialization from the list above.
Respond ONLY in this exact JSON format:
{
  "specialization": "exact specialization name from the list",
  "reason": "one sentence explanation why this specialization fits the symptoms",
  "urgency": "Low" 
}`;

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=Your_API_KEY", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      const candidate = data.candidates?.[0];
      if (candidate?.finishReason === "SAFETY") {
        throw new Error("AI blocked the response due to medical safety filters.");
      }

      const text = candidate?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("AI returned an empty response.");
      }

      const parsed = JSON.parse(text);

      const matchedSpec = specializations.find(
        (s) => s.name.toLowerCase() === parsed.specialization.toLowerCase()
      );

      if (matchedSpec) {
        const availableDoctors = doctors.filter(
          (d) => d.specialization && d.specialization.id === matchedSpec.id && d.available
        );
        setAiSuggestion({
          specialization: matchedSpec,
          doctor: availableDoctors[0] || null,
          reason: parsed.reason,
          urgency: parsed.urgency,
        });
      } else {
        toast.error("AI could not match a specialization. Please select manually.");
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      toast.error("AI suggestion failed: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // CONFIRM AI SUGGESTION
  // =========================
  const handleConfirmSuggestion = () => {
    if (!aiSuggestion) return;
    const spec = aiSuggestion.specialization;
    const filtered = doctors.filter((d) => d.specialization && d.specialization.id === spec.id);
    setFilteredDoctors(filtered);
    setForm({
      ...form,
      specializationId: String(spec.id),
      specialization: spec.name,
      doctor: aiSuggestion.doctor ? aiSuggestion.doctor.name : "",
      priority: aiSuggestion.urgency || "",
    });
    setAiSuggestion(null);
    toast.success("AI suggestion applied! ✅");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          doctor: form.doctor,
          specialization: form.specialization,
          date: form.date,
          time: form.time,
          symptoms: form.symptoms,
          priority: form.priority,
        }),
      });
      if (res.ok) {
        toast.success("Appointment booked successfully ✅");
        setForm({ name: "", email: "", doctor: "", specialization: "", specializationId: "", date: "", time: "", symptoms: "", priority: "" });
        setFilteredDoctors([]);
        setAiSuggestion(null);
        fetchMyAppointments();
      } else {
        const err = await res.json();
        toast.error(err.message || "Booking failed ❌");
      }
    } catch (error) {
      toast.error("Booking error ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const urgencyColor = (u) => u === "High" ? "#dc3545" : u === "Medium" ? "#fd7e14" : "#28a745";
  const urgencyEmoji = (u) => u === "High" ? "🔴" : u === "Medium" ? "🟡" : "🟢";

  return (
    <div className="container-fluid min-vh-100 p-5" style={{ background: "linear-gradient(to right, #4facfe, #00f2fe)" }}>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-white">🏥 Book an Appointment</h1>
          <p className="text-white">Smart Clinic Management System</p>
        </div>
        <button className="btn btn-danger btn-lg rounded-pill px-4" onClick={handleLogout}>Logout</button>
      </div>

      {/* BOOKING FORM */}
      <div className="card shadow-lg border-0 rounded-4 p-5 mb-5">
        <h3 className="fw-bold mb-4">📅 New Appointment</h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* PATIENT NAME */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Patient Name</label>
              <input type="text" className="form-control form-control-lg" placeholder="Enter patient name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            {/* EMAIL */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Patient Email</label>
              <input type="email" className="form-control form-control-lg" placeholder="Enter email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            {/* SYMPTOMS + AI BUTTON */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Symptoms
                <span className="ms-2 text-muted fw-normal" style={{ fontSize: "0.85rem" }}>
                  (Describe your symptoms and let AI suggest the right doctor)
                </span>
              </label>
              <textarea
                className="form-control form-control-lg mb-2"
                rows="3"
                placeholder="e.g. chest pain, shortness of breath, dizziness..."
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                required
              />
              <button
                type="button"
                className="btn btn-lg text-white fw-bold px-5"
                style={{
                  background: "linear-gradient(135deg, #6f42c1, #e83e8c)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  letterSpacing: "0.5px"
                }}
                onClick={handleAiSuggest}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Analysing symptoms...</>
                ) : (
                  <>🤖 AI Suggest Specialization</>
                )}
              </button>
            </div>

            {/* AI SUGGESTION CARD - UI FIXED */}
            {aiSuggestion && (
              <div className="col-12 mt-3">
                <div className="card border border-2 shadow-sm rounded-4 p-4"
                  style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>

                  {/* Card Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: "#6f42c1" }}>
                      🤖 AI Suggestion
                    </h5>
                    <span className="badge rounded-pill px-3 py-2 fw-semibold text-white"
                      style={{ background: urgencyColor(aiSuggestion.urgency), fontSize: "0.85rem" }}>
                      {urgencyEmoji(aiSuggestion.urgency)} {aiSuggestion.urgency} Priority
                    </span>
                  </div>

                  <hr style={{ borderColor: "#cbd5e1" }} />

                  {/* Symptoms shown */}
                  <p className="mb-3" style={{ color: "#64748b", fontSize: "0.95rem" }}>
                    <strong style={{ color: "#334155" }}>Symptoms:</strong> "{form.symptoms}"
                  </p>

                  {/* Specialization */}
                  <div className="d-flex align-items-center mb-2 gap-2">
                    <span style={{ fontSize: "1.4rem" }}>🩺</span>
                    <div>
                      <span className="fw-semibold" style={{ color: "#6f42c1" }}>Specialization: </span>
                      <span className="fw-bold" style={{ color: "#0f172a", fontSize: "1.1rem" }}>
                        {aiSuggestion.specialization.name}
                      </span>
                      {aiSuggestion.specialization.description && (
                        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          {" "}— {aiSuggestion.specialization.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Doctor */}
                  {aiSuggestion.doctor && (
                    <div className="d-flex align-items-center mb-2 gap-2">
                      <span style={{ fontSize: "1.4rem" }}>👨‍⚕️</span>
                      <div>
                        <span className="fw-semibold" style={{ color: "#6f42c1" }}>Recommended Doctor: </span>
                        <span className="fw-bold" style={{ color: "#0f172a", fontSize: "1.1rem" }}>
                          {aiSuggestion.doctor.name}
                        </span>
                        {aiSuggestion.doctor.experience && (
                          <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                            {" "}({aiSuggestion.doctor.experience} yrs exp)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="d-flex align-items-start mb-4 gap-2">
                    <span style={{ fontSize: "1.4rem" }}>📋</span>
                    <div>
                      <span className="fw-semibold" style={{ color: "#6f42c1" }}>Reason: </span>
                      <span style={{ color: "#334155", fontWeight: "500" }}>{aiSuggestion.reason}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-lg fw-bold px-4 shadow-sm"
                      style={{ background: "#22c55e", color: "white", borderRadius: "10px" }}
                      onClick={handleConfirmSuggestion}
                    >
                      ✅ Use this Suggestion
                    </button>
                    <button
                      type="button"
                      className="btn btn-lg fw-bold px-4 shadow-sm"
                      style={{ background: "#e2e8f0", color: "#334155", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                      onClick={() => setAiSuggestion(null)}
                    >
                      ❌ Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SPECIALIZATION DROPDOWN */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Specialization</label>
              <select className="form-select form-select-lg" value={form.specializationId}
                onChange={handleSpecializationChange} required>
                <option value="">🩺 Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}{spec.description ? ` — ${spec.description}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* DOCTOR DROPDOWN */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Doctor</label>
              <select className="form-select form-select-lg" value={form.doctor}
                onChange={handleDoctorChange} required disabled={!form.specializationId}>
                <option value="">{form.specializationId ? "👨‍⚕️ Select Doctor" : "Select specialization first"}</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} {doc.experience ? `(${doc.experience} yrs exp)` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Date</label>
              <input type="date" className="form-control form-control-lg"
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>

            {/* TIME */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Time</label>
              <select className="form-select form-select-lg" value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })} required>
                <option value="">⏰ Select Time</option>
                {["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
                  "12:00 PM","12:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
                  "04:00 PM","04:30 PM","05:00 PM"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* PRIORITY */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Priority</label>
              <select className="form-select form-select-lg" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })} required>
                <option value="">🚦 Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            {/* SUBMIT */}
            <div className="col-12 mt-2">
              <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill" disabled={loading}>
                {loading ? "Booking..." : "📅 Book Appointment"}
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* MY APPOINTMENTS */}
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h3 className="fw-bold mb-4">📋 My Appointments</h3>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Patient</th>
                <th>Specialization</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.length > 0 ? (
                myAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.specialization}</td>
                    <td>{a.doctor}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>
                      <span className={`badge ${a.priority === "High" ? "bg-danger" : a.priority === "Medium" ? "bg-warning text-dark" : "bg-success"}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${a.status === "Active" ? "bg-primary" : a.status === "Completed" ? "bg-success" : "bg-secondary"}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No appointments yet. Book your first one above! 😊
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Home;