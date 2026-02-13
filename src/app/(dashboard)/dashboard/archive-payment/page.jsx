"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Info, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

const ArchivePayment = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchArchive = async () => {
    if (!user?.firebase_uid) return;
    try {
      const res = await axios.get(`/api/payment?admin_uid=${user.firebase_uid}`);
      const archived = res.data.filter(p => p.status !== "pending");
      setPayments(archived);
    } catch (error) {
      toast.error("Failed to load archive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete record?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/payment?id=${id}&admin_uid=${user.firebase_uid}`);
        setPayments(prev => prev.filter(p => p._id !== id));
        toast.success("Record deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
    const matchesSearch = (p.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (p.transactionId?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase">Loading Archive...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Payment Archive</h1>
          <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Processed Transactions</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-3 h-4 w-4 opacity-40" />
            <input 
              type="text" placeholder="Search Email/Trx..." 
              className="input input-bordered rounded-xl bg-base-200 border-none font-bold pl-10 w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="select select-bordered rounded-xl font-bold bg-base-200 border-none"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All History</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-base-200 rounded-[2rem] overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-5">Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border-b border-base-300 hover:bg-base-100/50 transition-all">
                  <td className="p-5">
                    <div>{p.name}</div>
                    <div className="text-[10px] opacity-40 lowercase">{p.email}</div>
                  </td>
                  <td>
                    <div className="truncate max-w-[150px]">{p.course_name}</div>
                    <div className="text-[10px] text-primary">৳{p.course_price}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 opacity-60 text-xs">
                      <Clock size={12} />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm font-black uppercase text-[10px] py-3 rounded-lg ${
                      p.status === 'approved' ? 'badge-success shadow-lg shadow-success/20' : 'badge-error shadow-lg shadow-error/20'
                    }`}>
                      {p.status}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedPayment(p)} className="btn btn-square btn-ghost btn-sm text-info"><Info size={18} /></button>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && <div className="p-20 text-center opacity-30 font-bold uppercase tracking-widest">Archive Empty</div>}
        </div>
      </div>

      <input type="checkbox" id="archive-modal" className="modal-toggle" checked={!!selectedPayment} readOnly />
      <div className="modal">
        <div className="modal-box rounded-[2.5rem] p-8 border border-base-300 shadow-2xl max-w-3xl">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-black text-2xl uppercase tracking-tighter">Archive Details</h3>
            <button onClick={() => setSelectedPayment(null)} className="btn btn-ghost btn-circle btn-sm"><XCircle /></button>
          </div>
          
          {selectedPayment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-base-200 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase opacity-50 font-black">Transaction ID</p>
                    <p className="font-mono text-sm text-primary break-all">{selectedPayment.transactionId}</p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase opacity-50 font-black">Status</p>
                      <p className={`font-black uppercase text-xs ${selectedPayment.status === 'approved' ? 'text-success' : 'text-error'}`}>{selectedPayment.status}</p>
                    </div>
                    {selectedPayment.status === 'approved' ? <CheckCircle className="text-success" /> : <XCircle className="text-error" />}
                  </div>
                  <div className="bg-base-200 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase opacity-50 font-black">Phone Details</p>
                    <p className="text-xs">Sender: {selectedPayment.sender_number}</p>
                    <p className="text-xs">Receiver: {selectedPayment.receive_number}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase opacity-50 font-black ml-1">Payment Evidence</p>
                {selectedPayment.img ? (
                  <div className="relative group overflow-hidden rounded-3xl border-4 border-base-200 aspect-video md:aspect-square bg-base-300">
                    <img src={selectedPayment.img} className="w-full h-full object-cover" />
                    <a href={selectedPayment.img} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2 backdrop-blur-sm"><Eye size={20} /> View Full</a>
                  </div>
                ) : (
                  <div className="rounded-3xl border-4 border-dashed border-base-300 aspect-square flex items-center justify-center opacity-20 italic">No image</div>
                )}
              </div>
            </div>
          )}

          <div className="modal-action mt-8">
            <button onClick={() => setSelectedPayment(null)} className="btn btn-neutral rounded-xl px-12 font-bold uppercase">Close</button>
          </div>
        </div>
        <label className="modal-backdrop" onClick={() => setSelectedPayment(null)}></label>
      </div>
    </div>
  );
};

export default ArchivePayment;