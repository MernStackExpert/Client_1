"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, Chrome } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  if (user) router.push("/");

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Welcome to SpyMart!");
      router.push("/");
    } catch (error) {
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full bg-base-100 p-10 rounded-[3rem] shadow-2xl border border-base-300 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary p-4 rounded-3xl shadow-lg shadow-primary/20">
            <ShieldCheck className="h-10 w-10 text-primary-content" />
          </div>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Spy<span className="text-primary">Mart</span></h1>
        <p className="text-base-content/60 font-medium mb-10">Access your premium courses instantly</p>
        
        <button 
          onClick={handleLogin}
          className="btn btn-outline btn-lg w-full rounded-2xl gap-4 font-black border-2 hover:bg-primary hover:border-primary transition-all"
        >
          <Chrome className="h-6 w-6" />
          Continue with Google
        </button>

        <p className="mt-8 text-xs font-bold opacity-30 uppercase tracking-[0.2em]">
          Secure Authentication by Firebase
        </p>
      </div>
    </div>
  );
};

export default LoginPage;