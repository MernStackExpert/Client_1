"use client";
import React, { useEffect, useState } from "react";
import { Users, CreditCard, BookOpen, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalCourses: 0,
    revenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!user?.firebase_uid) return;

      try {
        const [usersRes, coursesRes, paymentsRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/course"),
          axios.get(`/api/payment?admin_uid=${user.firebase_uid}`),
        ]);

        const approvedPayments = paymentsRes.data.filter(p => p.status === "approved");
        const pendingPayments = paymentsRes.data.filter(p => p.status === "pending");
        const totalRevenue = approvedPayments.reduce((acc, curr) => acc + Number(curr.course_price), 0);

        setStats({
          totalUsers: usersRes.data.length,
          totalCourses: coursesRes.data.length,
          totalPayments: paymentsRes.data.length,
          pendingPayments: pendingPayments.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [user]);

  const chartData = [
    { name: "Users", count: stats.totalUsers },
    { name: "Courses", count: stats.totalCourses },
    { name: "Payments", count: stats.totalPayments },
    { name: "Pending", count: stats.pendingPayments },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Real-Time Overview</h1>
          <p className="opacity-50 font-bold text-sm uppercase tracking-widest mt-1">Platform Analytics Dashboard</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
          <p className="text-[10px] font-black uppercase opacity-50">Last Update</p>
          <p className="text-xs font-bold text-primary">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="relative z-10">
            <Users className="h-8 w-8 text-primary mb-4" />
            <div className="text-4xl font-black">{stats.totalUsers}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Total Students</div>
          </div>
          <TrendingUp className="absolute -bottom-2 -right-2 h-24 w-24 opacity-5 -rotate-12 group-hover:opacity-10 transition-all" />
        </div>

        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 relative overflow-hidden group hover:border-success/50 transition-all">
          <div className="relative z-10">
            <DollarSign className="h-8 w-8 text-success mb-4" />
            <div className="text-4xl font-black">৳{stats.revenue}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Total Revenue</div>
          </div>
          <ArrowUpRight className="absolute -bottom-2 -right-2 h-24 w-24 opacity-5 -rotate-12 group-hover:opacity-10 transition-all" />
        </div>

        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 relative overflow-hidden group hover:border-warning/50 transition-all">
          <div className="relative z-10">
            <BookOpen className="h-8 w-8 text-warning mb-4" />
            <div className="text-4xl font-black">{stats.totalCourses}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Active Courses</div>
          </div>
        </div>

        <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 relative overflow-hidden group hover:border-info/50 transition-all">
          <div className="relative z-10">
            <CreditCard className="h-8 w-8 text-info mb-4" />
            <div className="text-4xl font-black">{stats.pendingPayments}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Pending Payments</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-base-200 p-8 rounded-[3rem] border border-base-300">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Stats Summary</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-base-200 p-8 rounded-[3rem] border border-base-300">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Growth Metrics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 10, 10]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;