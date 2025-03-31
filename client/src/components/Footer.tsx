import { FC } from "react";
import { Link } from "wouter";
import { Twitter, Facebook, Instagram } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-emerald-500 font-bold text-lg mb-3">
              ISO9ja<span className="text-gray-100">Bet</span>
            </h3>
            <p className="text-gray-400 text-sm">
              The ultimate football prediction platform where you can win real cash without deposits.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#"><a className="hover:text-emerald-500">How It Works</a></Link></li>
              <li><Link href="/vip"><a className="hover:text-emerald-500">VIP Benefits</a></Link></li>
              <li><Link href="#"><a className="hover:text-emerald-500">Terms & Conditions</a></Link></li>
              <li><Link href="#"><a className="hover:text-emerald-500">Contact Us</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <p className="text-gray-400 text-sm mb-3">
              This platform offers predictions for entertainment purposes. Users must be 18+ to participate.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} ISO9jaBet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
