"use client";
import React, { useState, useEffect } from "react";
import { 
  Star, ShieldCheck, Globe, ShoppingCart, 
  CheckCircle2, Send, ArrowLeft, Copy, Check, X, User as UserIcon, Mail
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const CourseDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selectedMethod, setSelectedMethod] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const paymentMethods = [
    { name: "Bkash (Personal)", number: "017XXXXXXXX" },
    { name: "Nagad (Personal)", number: "018XXXXXXXX" },
    { name: "Rocket (Personal)", number: "019XXXXXXXX" }
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/course?id=${id}`);
        setCourse(res.data);
      } catch (error) {
        toast.error("Course not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Number Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_img_api_URL}`, formData);
      setImageUrl(res.data.data.url);
      toast.success("Screenshot uploaded!");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if(!selectedMethod || !senderNumber || !trxId || !userName || !userEmail) {
        return toast.error("Please fill all required fields");
    }

    setSubmitting(true);

    const paymentData = {
      receive_number: selectedMethod,
      sender_number: senderNumber,
      transactionId: trxId,
      img: imageUrl,
      email: userEmail, 
      name: userName,
      course_name: course.course_name,
      course_id: course._id,
      course_price: course.course_price,
      drive_link: course.drive_link
    };

    try {
      await axios.post("/api/payment", paymentData);
      
      setShowModal(false);
      
      Swal.fire({
        title: "Success!",
        text: "Your payment request has been submitted. After approval, you will receive the course link via email.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        customClass: {
            popup: 'rounded-[2rem]'
        }
      });

      setSenderNumber("");
      setTrxId("");
      setUserName("");
      setUserEmail("");
      setImageUrl("");
      setSelectedMethod("");

    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong. Please try again or contact support.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <button onClick={() => router.back()} className="btn btn-ghost gap-2 font-bold hover:bg-base-200 rounded-xl transition-all">
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
      </div>

      <div className="bg-base-200 py-12 md:py-20 border-b border-base-300 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <span className="badge badge-primary badge-outline px-4 py-3 uppercase tracking-widest text-[10px]">Premium Resource</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary" /> {course.course_rating} Rating
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                {course.course_name}
              </h1>
              <p className="mt-6 text-lg text-base-content/70 max-w-xl leading-relaxed">
                {course.course_description}
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold opacity-80">
                <div className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Instant Delivery</div>
                <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Lifetime Access</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Verified Content</div>
              </div>
            </div>

            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl overflow-hidden shadow-2xl border-8 border-base-100 ring-1 ring-base-300"
              >
                <img src={course.course_img} alt={course.course_name} className="w-full h-auto" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Course Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Complete recorded high-quality video modules.",
                  "Permanent Google Drive access link.",
                  "All necessary project source codes and files.",
                  "Self-paced learning with lifetime updates."
                ].map((text, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-5 rounded-2xl bg-base-200/50 border border-base-300/50">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-base-content/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">How it works?</h3>
              <p className="text-base-content/70 leading-loose">
                {course.course_description} এই কোর্সটি কিনলে আপনি সরাসরি আপনার ইমেইলে একটি গুগল ড্রাইভ লিঙ্ক পাবেন। ড্রাইভের ভেতরে সকল ভিডিও এবং রিসোর্স ফাইল সাজানো থাকবে যা আপনি আজীবন যেকোনো সময় দেখতে বা ডাউনলোড করতে পারবেন। কোনো হিডেন চার্জ নেই, একবার পেমেন্ট করলেই আজীবনের জন্য এক্সেস।
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-base-100 border border-base-200 rounded-3xl p-8 shadow-xl shadow-base-300/50">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-primary">৳{course.course_price}</span>
                <span className="text-base-content/50 line-through mb-1">৳{course.course_price + 1000}</span>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary btn-lg w-full rounded-2xl font-black text-lg gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                >
                  <ShoppingCart className="h-6 w-6" /> Buy Now
                </button>
                <div className="flex flex-col gap-2">
                  <p className="text-center text-[10px] text-base-content/50 font-bold uppercase tracking-widest">Manual Payment with Bkash/Nagad</p>
                  <p className="text-center text-[10px] text-primary font-bold italic">Delivery via Email after approval</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-base-200">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-60">You will get:</h4>
                <ul className="space-y-3 text-sm font-medium text-base-content/70">
                  <li className="flex items-center gap-3">✓ Private Google Drive Access</li>
                  <li className="flex items-center gap-3">✓ Permanent Enrollment</li>
                  <li className="flex items-center gap-3">✓ Lifetime Course Updates</li>
                  <li className="flex items-center gap-3">✓ Source Code & Assets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-base-100 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="bg-primary p-8 text-primary-content relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Payment</h3>
                  <p className="opacity-80 font-medium text-sm">Send money to complete enrollment</p>
                </div>
                <ShoppingCart className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10 rotate-12" />
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Your Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-3 h-5 w-5 text-base-content/30" />
                        <input type="text" placeholder="MD Nirob Sarkar" className="input input-bordered w-full rounded-2xl font-bold bg-base-200 border-none pl-12" onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3 h-5 w-5 text-base-content/30" />
                        <input type="email" placeholder="nirob@example.com" className="input input-bordered w-full rounded-2xl font-bold bg-base-200 border-none pl-12" onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Payment Method</label>
                  <select 
                    className="select select-bordered w-full rounded-2xl font-bold bg-base-200 border-none focus:ring-2 ring-primary/20"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Bkash/Nagad/Rocket</option>
                    {paymentMethods.map((m, i) => (
                      <option key={i} value={`${m.name}: ${m.number}`}>{m.name} - {m.number}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence mode="wait">
                  {selectedMethod && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl border border-primary/20"
                    >
                      <span className="font-mono font-black text-primary text-lg">{selectedMethod.split(": ")[1]}</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(selectedMethod.split(": ")[1])}
                        className="btn btn-primary btn-sm rounded-xl gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4 text-sm font-semibold p-4 bg-base-200 rounded-2xl italic opacity-70">
                    * Please send money (Send Money) to the number above and provide details below.
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Your Sender Number</label>
                    <input type="text" placeholder="01XXXXXXXXX" className="input input-bordered w-full rounded-2xl font-bold bg-base-200 border-none" onChange={(e) => setSenderNumber(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Transaction ID</label>
                    <input type="text" placeholder="TRX12345678" className="input input-bordered w-full rounded-2xl font-bold bg-base-200 border-none" onChange={(e) => setTrxId(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Screenshot (Optional)</label>
                  <div className="relative group">
                    <input type="file" className="file-input file-input-primary w-full rounded-2xl font-bold bg-base-200 border-none" onChange={handleImageUpload} />
                    {uploading && <span className="absolute right-4 top-3 loading loading-spinner loading-sm text-primary"></span>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || submitting}
                  className="btn btn-primary w-full rounded-2xl font-black text-lg h-16 shadow-xl shadow-primary/20 mt-4"
                >
                  {submitting ? (
                      <span className="loading loading-spinner">Submitting...</span>
                  ) : (
                      "Confirm Payment"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetails;