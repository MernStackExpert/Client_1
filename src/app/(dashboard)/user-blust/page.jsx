"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { BookOpen, CreditCard, Clock, ExternalLink, DollarSign, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyHistory = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`/api/payment?email=${user.email}`);
        setMyPayments(res.data);
      } catch (error) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchMyHistory();
  }, [user]);

  const stats = {
    totalBought: myPayments.filter(p => p.status === "approved").length,
    pending: myPayments.filter(p => p.status === "pending").length,
    totalSpent: myPayments.filter(p => p.status === "approved").reduce((acc, curr) => acc + Number(curr.course_price), 0)
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black bg-base-100 uppercase tracking-widest">Loading Learning Space...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-black uppercase opacity-50 hover:opacity-100 hover:text-primary transition-all mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">My Learning Overview</h1>
          <p className="opacity-50 font-bold text-sm uppercase tracking-widest mt-1">Track your courses and payments</p>
        </div>

        <Link href="/" className="btn btn-ghost btn-circle bg-base-200 shadow-sm">
          <Home size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 flex items-center gap-6 group hover:border-primary/30 transition-all">
          <div className="bg-primary/10 p-4 rounded-2xl text-primary"><BookOpen /></div>
          <div>
            <div className="text-3xl font-black">{stats.totalBought}</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Enrolled Courses</div>
          </div>
        </div>

        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 flex items-center gap-6 group hover:border-success/30 transition-all">
          <div className="bg-success/10 p-4 rounded-2xl text-success"><DollarSign /></div>
          <div>
            <div className="text-3xl font-black">৳{stats.totalSpent}</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Total Investment</div>
          </div>
        </div>

        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 flex items-center gap-6 group hover:border-warning/30 transition-all">
          <div className="bg-warning/10 p-4 rounded-2xl text-warning"><Clock /></div>
          <div>
            <div className="text-3xl font-black">{stats.pending}</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Pending Access</div>
          </div>
        </div>
      </div>

      <div className="bg-base-200 rounded-[3rem] border border-base-300 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-base-300 flex justify-between items-center bg-base-200/50">
          <h2 className="font-black uppercase tracking-tighter text-xl">Recent Transactions</h2>
          <CreditCard className="opacity-20" />
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300/50 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-5">Course Name</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-right p-5">Course Access</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {myPayments.map((p) => (
                <tr key={p._id} className="border-b border-base-300 last:border-none hover:bg-base-100/30 transition-all">
                  <td className="p-5">
                    <div className="text-sm">{p.course_name}</div>
                    <div className="text-[10px] opacity-40 uppercase font-mono tracking-tighter">{p.transactionId}</div>
                  </td>
                  <td>৳{p.course_price}</td>
                  <td>
                    <div className={`badge badge-sm font-black uppercase text-[10px] py-3 px-4 rounded-xl border-none ${
                      p.status === 'approved' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {p.status}
                    </div>
                  </td>
                  <td className="text-right p-5">
                    {p.status === "approved" ? (
                      <a href={p.drive_link} target="_blank" className="btn btn-primary btn-sm rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                        <ExternalLink size={14} /> View Course
                      </a>
                    ) : (
                      <button className="btn btn-disabled btn-sm rounded-xl opacity-30 italic font-medium">Waiting for Approval</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myPayments.length === 0 && (
            <div className="p-24 text-center">
              <div className="opacity-20 font-black uppercase tracking-[0.2em] text-sm">No Enrollment History Found</div>
              <Link href="/courses" className="btn btn-link btn-sm no-underline text-primary font-black uppercase mt-4">Browse Courses</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;