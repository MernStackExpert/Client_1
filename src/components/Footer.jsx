import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-base-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <ShieldCheck className="text-primary-content h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">SPY<span className="text-primary">MART</span></span>
            </Link>
            <p className="text-sm text-base-content/60 leading-relaxed">
              SpyMart is a premium course selling platform dedicated to providing the best learning resources for students.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-base-content/60">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-base-content/60">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <div className="join w-full">
              <input className="input input-bordered join-item w-full" placeholder="Email" />
              <button className="btn btn-primary join-item">Join</button>
            </div>
          </div>
        </div>
        <div className="border-t border-base-content/10 pt-8 text-center text-sm text-base-content/40">
          <p>© {new Date().getFullYear()} SpyMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;