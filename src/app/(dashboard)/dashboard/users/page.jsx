"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2, ShieldCheck, User as UserIcon, Mail, Calendar, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

const UsersList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    if (targetUser.firebase_uid === currentUser?.firebase_uid) {
      return toast.error("Security Alert: You cannot change your own admin status!");
    }

    const newRole = targetUser.role === "admin" ? "student" : "admin";

    const result = await Swal.fire({
      title: "Update Role?",
      text: `Change ${targetUser.name}'s access to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Update Role"
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Processing...");
      try {
        await axios.patch("/api/user", {
          admin_uid: currentUser.firebase_uid,
          firebase_uid: targetUser.firebase_uid,
          role: newRole,
          name: targetUser.name
        });
        setUsers(prev => prev.map(u => u.firebase_uid === targetUser.firebase_uid ? { ...u, role: newRole } : u));
        toast.success(`User is now an ${newRole}`, { id: toastId });
      } catch (error) {
        toast.error("Failed to update role", { id: toastId });
      }
    }
  };

  const handleDelete = async (userId, firebaseUid) => {
    if (firebaseUid === currentUser?.firebase_uid) {
      return toast.error("Action Denied: You cannot delete your own account!");
    }

    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "This user and their data will be permanently deleted.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Now"
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Deleting user...");
      try {
        await axios.delete(`/api/user?id=${userId}&admin_uid=${currentUser.firebase_uid}`);
        setUsers(prev => prev.filter(u => u._id !== userId));
        toast.success("User permanently deleted", { id: toastId });
      } catch (error) {
        toast.error("Deletion failed. Try again.", { id: toastId });
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest bg-base-100">Fetching Database...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">User Management</h1>
          <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Total Users: {users.length}</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 opacity-40" />
          <input 
            type="text" 
            placeholder="Search community..." 
            className="input input-bordered rounded-xl bg-base-200 border-none font-bold pl-10 w-full focus:ring-2 ring-primary/20"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-base-200 rounded-[2rem] overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-5">Profile</th>
                <th>Role</th>
                <th>Created</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-b border-base-300 hover:bg-base-100 transition-all">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={u.img || "/default-avatar.png"} alt={u.name} className="object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-black flex items-center gap-2">
                          {u.name} 
                          {u.firebase_uid === currentUser?.firebase_uid && <span className="badge badge-primary badge-xs">YOU</span>}
                        </div>
                        <div className="text-[10px] opacity-40 flex items-center gap-1"><Mail size={10} /> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm font-black uppercase text-[10px] py-3 px-4 rounded-xl border-none ${
                      u.role === 'admin' ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/60'
                    }`}>
                      {u.role === 'admin' ? <ShieldCheck size={12} className="mr-1.5" /> : <UserIcon size={12} className="mr-1.5" />}
                      {u.role}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 opacity-50 text-[10px] uppercase">
                      <Calendar size={12} />
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Old Account"}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleRole(u)}
                        className={`btn btn-square btn-ghost btn-sm transition-all cursor-pointer ${u.firebase_uid === currentUser?.firebase_uid ? 'opacity-20 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                        disabled={u.firebase_uid === currentUser?.firebase_uid}
                        title="Change Role"
                      >
                        <ArrowLeftRight size={18} />
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(u._id, u.firebase_uid)} 
                        className={`btn btn-square btn-ghost btn-sm transition-all cursor-pointer ${u.firebase_uid === currentUser?.firebase_uid ? 'opacity-20 cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        disabled={u.firebase_uid === currentUser?.firebase_uid}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center opacity-30 font-black uppercase tracking-widest text-xs">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;