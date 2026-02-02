import { Target } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
         <div className="col-span-1 md:col-span-2">
           <a href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-400/20">
                 <Target size={18} strokeWidth={3} />
              </div>
              <h4 className="font-bold text-2xl tracking-tight">Questerix</h4>
           </a>
           <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
             Empowering students worldwide with accessible, high-quality education technology.
           </p>
         </div>
         
         <div className="col-span-1 md:col-span-1">
           <h5 className="font-bold mb-6 text-gray-200">Platform</h5>
           <ul className="space-y-4 text-gray-400">
             <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
             <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
           </ul>
         </div>
         
         <div className="col-span-1 md:col-span-1">
           <h5 className="font-bold mb-6 text-gray-200">Get the App</h5>
           <ul className="space-y-4 text-gray-400">
             <li><a href="/download/ios" className="hover:text-white transition-colors flex items-center gap-2">Download for iOS</a></li>
             <li><a href="/download/android" className="hover:text-white transition-colors flex items-center gap-2">Download for Android</a></li>
           </ul>
         </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center md:text-left text-gray-500 text-sm flex justify-between items-center">
        <p>© 2024 Questerix Inc. All rights reserved.</p>
        <div className="flex gap-6">
           <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
           <a href="/terms" className="hover:text-white transition-colors">Terms</a>
           <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
