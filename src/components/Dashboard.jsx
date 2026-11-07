import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Dashboard = () => {
  const { user, setIsAuthenticated, setUser } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/appointment/doctor/getall",
        { withCredentials: true }
      );
      setAppointments(data.appointments);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load appointments!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctor/update/${id}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((items) =>
        items.map((item) => (item._id === id ? data.appointment : item))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update appointment!");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/doctor/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser({});
      toast.success("Doctor Logged Out Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  const accepted = useMemo(
    () => appointments.filter((item) => item.status === "Accepted").length,
    [appointments]
  );
  const pending = useMemo(
    () => appointments.filter((item) => item.status === "Pending").length,
    [appointments]
  );

  if (loading) return <div className="center">Loading appointments...</div>;

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="doctor-title">
          <img src="/logo.png" alt="Life Care" />
          <div>
            <h1>Doctor Dashboard</h1>
            <p>Welcome, Dr. {user?.firstName} {user?.lastName}</p>
          </div>
        </div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </header>

      <section className="profile-grid">
        <div className="profile-card">
          <img src={user?.doctrAvatar?.url || "/doc.png"} alt="Doctor" />
          <div>
            <h2>Dr. {user?.firstName} {user?.lastName}</h2>
            <p><strong>Department:</strong> {user?.doctrDptmnt || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
          </div>
        </div>
        <div className="stat"><span>Total Appointments</span><strong>{appointments.length}</strong></div>
        <div className="stat"><span>Pending</span><strong>{pending}</strong></div>
        <div className="stat"><span>Accepted</span><strong>{accepted}</strong></div>
      </section>

      <section className="appointments-card">
        <div className="section-heading">
          <h2>My Appointments</h2>
          <span>{appointments.length} total</span>
        </div>
        {appointments.length === 0 ? (
          <div className="empty">No appointments assigned to you.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Visited</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <strong>{appointment.firstName} {appointment.lastName}</strong>
                      <small>{appointment.email}</small>
                    </td>
                    <td>{appointment.phone}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.gender}</td>
                    <td>
                      <select
                        className={`status ${appointment.status.toLowerCase()}`}
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>{appointment.hasVisited ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
