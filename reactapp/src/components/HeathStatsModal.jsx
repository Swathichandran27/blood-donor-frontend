import React, { useState } from "react";
import axios from "axios";
import authService from "../services/AuthService";

const HealthStatsModal = ({ appointment, onClose, onSave }) => {
  const [pulse, setPulse] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [notes, setNotes] = useState("");

  const token = authService.getToken();

  const saveStats = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/healthstats/${appointment.id}`,
        { pulse, systolicPressure: systolic, diastolicPressure: diastolic, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave();
      onClose();
    } catch (err) {
      alert("Failed to save health stats");
    }
  };

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Add Health Stats for Appointment #{appointment.id}</h5>
          <div className="mb-2">
            <label>Pulse</label>
            <input type="number" value={pulse} onChange={e => setPulse(e.target.value)} className="form-control"/>
          </div>
          <div className="mb-2">
            <label>Systolic Pressure</label>
            <input type="number" value={systolic} onChange={e => setSystolic(e.target.value)} className="form-control"/>
          </div>
          <div className="mb-2">
            <label>Diastolic Pressure</label>
            <input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} className="form-control"/>
          </div>
          <div className="mb-2">
            <label>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-control"/>
          </div>
          <button className="btn btn-success me-2" onClick={saveStats}>Save</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default HealthStatsModal;
