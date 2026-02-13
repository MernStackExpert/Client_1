"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Search, Eye, Info, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

const ManagePayment = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    if (!user?.firebase_uid) return;
    try {
      const res = await axios.get(`/api/payment?admin_uid=${user.firebase_uid}`);
      const pendingOnly = res.data.filter(p => p.status === "pending");
      setPayments(pendingOnly);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleStatusUpdate = async (paymentId, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Update status to ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm"
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Updating status...");
      try {
        const response = await axios.patch("/api/payment", {
          paymentId,
          status,
          admin_uid: user.firebase_uid
        });

        if (response.data.message === "Success") {
          setPayments((prev) => prev.filter((p) => p._id !== paymentId));
          toast.success("Updated successfully!", { id: toastId });
          setSelectedPayment(null);
        }
      } catch (error) {
        toast.error("Action failed, please try again", { id: toastId });
      }
    }
  };

  const filteredPayments = payments.filter(p => 
    (p.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (p.transactionId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Pending Payments</h1>
          <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Total Pending: {payments.length}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 opacity-40" />
          <input 
            type="text" placeholder="Search Email/Trx..." 
            className="input input-bordered rounded-xl bg-base-200 border-none font-bold pl-10 w-full md:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-base-200 rounded-[2rem] overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300 font-black uppercase text-[10px]">
              <tr>
                <th className="p-5">Student Info</th>
                <th>Course Details</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border-b border-base-300 hover:bg-base-100/50 transition-all">
                  <td className="p-5">
                    <div className="text-sm">{p.name}</div>
                    <div className="text-[10px] opacity-40 lowercase">{p.email}</div>
                  </td>
                  <td>
                    <div className="text-sm truncate max-w-[150px]">{p.course_name}</div>
                    <div className="text-[10px] text-primary">৳{p.course_price}</div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPayment(p)}
                        className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                        title="View Details"
                      >
                        <Info size={18} />
                      </button>
                      <button onClick={() => handleStatusUpdate(p._id, "approved")} className="btn btn-success btn-sm btn-square rounded-lg shadow-lg shadow-success/20">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => handleStatusUpdate(p._id, "rejected")} className="btn btn-error btn-sm btn-square rounded-lg shadow-lg shadow-error/20">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && <div className="p-20 text-center opacity-30 font-bold uppercase">No pending payments</div>}
        </div>
      </div>

      <input type="checkbox" id="details-modal" className="modal-toggle" checked={!!selectedPayment} readOnly />
      <div className="modal">
        <div className="modal-box rounded-[2.5rem] p-8 border border-base-300 shadow-2xl max-w-2xl">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-black text-2xl uppercase tracking-tighter">Payment Evidence</h3>
            <button onClick={() => setSelectedPayment(null)} className="btn btn-ghost btn-circle btn-sm"><XCircle /></button>
          </div>
          
          {selectedPayment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-base-200 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase opacity-50 font-black">Transaction ID</p>
                    <p className="font-mono text-sm text-primary break-all">{selectedPayment.transactionId}</p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase opacity-50 font-black">Sender Number</p>
                    <p className="font-bold">{selectedPayment.sender_number}</p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase opacity-50 font-black">Receiver (Method)</p>
                    <p className="font-bold">{selectedPayment.receive_number}</p>
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[10px] uppercase opacity-50 font-black">Drive Link</p>
                  <p className="text-[10px] font-medium truncate">{selectedPayment.drive_link}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase opacity-50 font-black ml-1">Payment Screenshot</p>
                {selectedPayment.img ? (
                  <div className="relative group overflow-hidden rounded-3xl border-4 border-base-200 aspect-[3/4] bg-base-300">
                    <img 
                      src={selectedPayment.img} 
                      alt="Proof" 
                      className="w-full h-full object-cover"
                    />
                    <a 
                      href={selectedPayment.img} 
                      target="_blank" 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2 backdrop-blur-sm"
                    >
                      <Eye size={20} /> View Full
                    </a>
                  </div>
                ) : (
                  <div className="rounded-3xl border-4 border-dashed border-base-300 aspect-[3/4] flex flex-col items-center justify-center opacity-30">
                    <ImageIcon size={48} />
                    <p className="text-xs font-black uppercase mt-2">No Image Provided</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="modal-action mt-8 gap-3">
            <button onClick={() => handleStatusUpdate(selectedPayment._id, "approved")} className="btn btn-success flex-1 rounded-xl font-bold uppercase">Approve</button>
            <button onClick={() => setSelectedPayment(null)} className="btn btn-neutral rounded-xl px-8 font-bold uppercase">Close</button>
          </div>
        </div>
        <label className="modal-backdrop" onClick={() => setSelectedPayment(null)}>Close</label>
      </div>
    </div>
  );
};

export default ManagePayment;