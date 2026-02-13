"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CloudUpload, Link as LinkIcon, DollarSign, Type, FileText, Star, ShoppingBag, ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const EditCourse = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [formData, setFormData] = useState({
    course_name: "",
    course_price: "",
    course_rating: "",
    course_description: "",
    course_sell: "",
    course_img: "",
    drive_link: ""
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await axios.get(`/api/course?id=${id}`);
        setFormData({
          course_name: res.data.course_name,
          course_price: res.data.course_price,
          course_rating: res.data.course_rating,
          course_description: res.data.course_description,
          course_sell: res.data.course_sell,
          course_img: res.data.course_img,
          drive_link: res.data.drive_link
        });
      } catch (error) {
        toast.error("Failed to load course data");
        router.push("/dashboard/manage-course");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCourseData();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_img_api_URL}`,
        imageFormData
      );
      if (res.data.success) {
        setFormData({ ...formData, course_img: res.data.data.url });
        toast.success("New image uploaded!");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch("/api/course", { 
        ...formData, 
        course_id: id, 
        admin_uid: user.firebase_uid 
      });
      toast.success("Course Updated Successfully!");
      router.push("/dashboard/manage-course");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest bg-base-100 text-primary">Loading course details...</div>;

  return (
    <div className="p-6 lg:p-10 bg-base-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/dashboard/manage-course" className="flex items-center gap-2 font-black uppercase text-xs opacity-50 hover:opacity-100 transition-all">
          <ArrowLeft size={16} /> Cancel and Return
        </Link>

        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Edit Course</h1>
          <p className="opacity-50 font-bold text-sm uppercase tracking-widest mt-1">Modify existing course information</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-200 p-8 rounded-[2.5rem] space-y-6">
              <div className="form-control">
                <label className="label font-black text-xs uppercase opacity-50">Course Title</label>
                <div className="relative">
                  <Type className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                  <input 
                    type="text" required
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold" 
                    value={formData.course_name}
                    onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-black text-xs uppercase opacity-50">Price (BDT)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                    <input 
                      type="number" required
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold" 
                      value={formData.course_price}
                      onChange={(e) => setFormData({...formData, course_price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label font-black text-xs uppercase opacity-50">Rating</label>
                  <div className="relative">
                    <Star className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                    <input 
                      type="number" step="0.1" max="5" required
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold" 
                      value={formData.course_rating}
                      onChange={(e) => setFormData({...formData, course_rating: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label font-black text-xs uppercase opacity-50">Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 opacity-30 h-5 w-5" />
                  <textarea 
                    required
                    className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold min-h-[180px]" 
                    value={formData.course_description}
                    onChange={(e) => setFormData({...formData, course_description: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-base-200 p-6 rounded-[2.5rem] space-y-6">
              <div className="form-control">
                <label className="label font-black text-xs uppercase opacity-50">Update Thumbnail</label>
                
                <div className="flex bg-base-300 p-1 rounded-xl mb-4">
                  <button type="button" onClick={() => setActiveTab("upload")} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === "upload" ? "bg-base-100 shadow-sm" : "opacity-50"}`}>Upload</button>
                  <button type="button" onClick={() => setActiveTab("url")} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === "url" ? "bg-base-100 shadow-sm" : "opacity-50"}`}>URL</button>
                </div>

                {activeTab === "upload" ? (
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="edit-img-upload" />
                    <label htmlFor="edit-img-upload" className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-base-300 hover:border-primary cursor-pointer transition-all overflow-hidden bg-base-100">
                      {uploading ? <span className="loading loading-spinner text-primary"></span> : <img src={formData.course_img} className="w-full h-full object-cover" alt="Preview" />}
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                    <input 
                      type="url"
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold text-xs" 
                      value={formData.course_img}
                      onChange={(e) => setFormData({...formData, course_img: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label font-black text-xs uppercase opacity-50">Access Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                  <input 
                    type="url" required
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold text-xs" 
                    value={formData.drive_link}
                    onChange={(e) => setFormData({...formData, drive_link: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label font-black text-xs uppercase opacity-50">Sales Count</label>
                <div className="relative">
                  <ShoppingBag className="absolute left-4 top-3.5 opacity-30 h-5 w-5" />
                  <input 
                    type="number"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-none pl-12 font-bold" 
                    value={formData.course_sell}
                    onChange={(e) => setFormData({...formData, course_sell: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || uploading}
                className="btn btn-primary w-full rounded-2xl font-black uppercase h-14"
              >
                {loading ? <span className="loading loading-spinner"></span> : "Update Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;