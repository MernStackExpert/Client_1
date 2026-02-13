"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Search, BookOpen, Star, Users } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

const ManageCourse = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/course");
      setCourses(res.data);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be deleted forever!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/course?id=${id}&admin_uid=${user.firebase_uid}`);
        setCourses(prev => prev.filter(c => c._id !== id));
        toast.success("Course deleted!");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest bg-base-100">Loading Courses...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Manage Courses</h1>
          <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Total Assets: {courses.length}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-3.5 h-4 w-4 opacity-40" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="input input-bordered rounded-xl bg-base-200 border-none font-bold pl-10 w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/dashboard/manage-course/add" className="btn btn-primary rounded-xl font-bold gap-2">
            <Plus size={20} /> Add New
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-base-200 rounded-[2.5rem] border border-base-300 overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
              <img src={course.course_img} alt={course.course_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-black text-primary border border-primary/20">
                ৳{course.course_price}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-black text-xl leading-tight h-14 overflow-hidden">{course.course_name}</h3>
              
              <div className="flex items-center justify-between text-xs font-bold opacity-60 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> {course.course_sell} Sales</div>
                <div className="flex items-center gap-1.5"><Star size={14} className="text-warning fill-warning" /> {course.course_rating}</div>
              </div>

              <div className="pt-4 border-t border-base-300 flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(course._id)} className="btn btn-square btn-ghost btn-md text-error hover:bg-error/10 transition-all cursor-pointer"><Trash2 size={20} /></button>
                  <Link href={`/dashboard/manage-course/edit/${course._id}`} className="btn btn-square btn-ghost btn-md text-primary hover:bg-primary/10 transition-all cursor-pointer"><Edit size={20} /></Link>
                </div>
                <a href={course.drive_link} target="_blank" className="btn btn-ghost btn-circle btn-md text-info hover:bg-info/10 transition-all cursor-pointer">
                  <Eye size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCourse;