"use client";
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../component/landlord/context";
export default function Applications() {
  const { user } = useContext(DashboardContext);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, studentRes, propertyRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applications?landlordId=${user.id}`
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/properties?landlordId=${user.id}`
          ),
        ]);
        if (appRes.ok) {
          setApplications(await appRes.json());
        }
        if (studentRes.ok) {
          setStudents(await studentRes.json());
        }
        if (propertyRes.ok) {
          setProperties(await propertyRes.json());
        }
      } catch (err) {
        console.error("Fetch applications error:", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const endpoint =
        status === "approved"
          ? `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/approve`
          : `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...applications.find((a) => a.id === id),
          status,
        }),
      });
      if (res.ok) {
        setApplications(
          applications.map((a) => (a.id === id ? { ...a, status } : a))
        );
      } else {
        alert(`Failed to ${status} application`);
      }
    } catch (err) {
      console.error("Update application error:", err);
      alert("Error updating application");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      <ul className="space-y-2">
        {applications.map((app) => {
          const student = students.find((s) => s.id === app.studentId);
          const property = properties.find((p) => p.id === app.propertyId);
          return (
            <li
              key={app.id}
              className="bg-white p-4 shadow rounded flex justify-between"
            >
              <span>
                {student
                  ? `${student.name} (${student.email})`
                  : `Student ID: ${app.studentId}`}{" "}
                -
                {property
                  ? ` ${property.title}`
                  : ` Property ID: ${app.propertyId}`}{" "}
                - Status: {app.status}
              </span>
              <div>
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(app.id, "approved")}
                      className="text-green-500 hover:underline mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app.id, "rejected")}
                      className="text-red-500 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
