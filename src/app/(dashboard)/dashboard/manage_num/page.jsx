"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

export default function ManageNum() {
  const { user, loading: authLoading } = useAuth();

  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [editing, setEditing] = useState(null);

  // ================= FETCH =================
  const fetchNumbers = async () => {
    try {
      const res = await axios.get("/api/pay_num");
      setNumbers(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch numbers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchNumbers();
  }, [authLoading]);

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !number) {
      return Swal.fire("Warning", "All fields are required", "warning");
    }

    try {
      if (editing) {
        await axios.patch("/api/pay_num", {
          admin_uid: user?.firebase_uid,
          id: editing._id,
          name,
          number,
        });

        Swal.fire("Updated!", "Number updated successfully", "success");
      } else {
        await axios.post("/api/pay_num", {
          admin_uid: user?.firebase_uid,
          name,
          number,
        });

        Swal.fire("Added!", "Number added successfully", "success");
      }

      setName("");
      setNumber("");
      setEditing(null);
      fetchNumbers();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Action failed",
        "error"
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This number will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `/api/pay_num?id=${id}&admin_uid=${user?.firebase_uid}`
      );

      Swal.fire("Deleted!", "Number has been deleted.", "success");
      fetchNumbers();
    } catch (error) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  // ================= ADMIN GUARD =================
  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-bold text-red-500">
        Access Denied (Admin Only)
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Manage Payment Numbers
      </h1>

      {/* ================= FORM ================= */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Payment Name (Bkash, Nagad...)"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Number"
              className="input input-bordered w-full"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
            >
              {editing ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Number</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {numbers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No Data Found
                </td>
              </tr>
            )}

            {numbers.map((item, index) => (
              <tr key={item._id} className="hover">
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.number}</td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      setEditing(item);
                      setName(item.name);
                      setNumber(item.number);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}