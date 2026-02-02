import { ArrowRight, BookOpen, Sigma, FlaskConical, Target, GraduationCap } from 'lucide-react';
import { Header } from '../components/Header';

const SubjectCard = ({ 
  title, 
  description, 
  icon: Icon, 
  colorClass, 
  bgClass,
  link 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  colorClass: string; 
  bgClass: string;
  link: string;
}) => (
  <div 
    onClick={() => window.location.href = link}
    className="group bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
    
    <div className={`w-14 h-14 ${bgClass} rounded-xl mb-6 flex items-center justify-center ${colorClass} shadow-inner`}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    
    <h4 className="text-2xl font-bold mb-3 text-gray-900">{title}</h4>
    <p className="text-gray-500 leading-relaxed mb-6">{description}</p>
    
    <div className={`flex items-center font-semibold ${colorClass} group-hover:translate-x-2 transition-transform`}>
      <span>Explore</span>
      <ArrowRight size={18} className="ml-2" />
    </div>
  </div>
);

export const RootPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32 text-center relative">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/50 -z-10 blur-3xl rounded-full opacity-60 mix-blend-multiply animate-pulse-slow"></div>
          <div className="absolute top-20 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-purple-100/50 -z-10 blur-3xl rounded-full opacity-60 mix-blend-multiply animate-pulse-slow delay-700"></div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            Transform Your <br />
            <span className="text-gradient">Academic Journey</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            From Preschool to University - Master every subject with personalized learning paths, real-time analytics, and gamified progress.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Learning Free <ArrowRight size={20} />
            </button>
            <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <GraduationCap size={20} /> View Curriculum
            </button>
          </div>
        </section>

        {/* Subjects Grid */}
        <section id="subjects" className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore Subjects</h2>
              <p className="text-gray-500 text-lg">Select a domain to begin your quest.</p>
            </div>
            <a href="#" className="flex items-center font-medium text-blue-600 hover:text-blue-700 group">
              View all subjects <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <SubjectCard 
               title="Mathematics"
               description="Master the language of the universe. From basic arithmetic to advanced calculus."
               icon={Sigma}
               colorClass="text-blue-600"
               bgClass="bg-blue-50"
               link={window.location.hostname.includes('localhost') ? '/?subdomain=math' : 'https://math.questerix.com'}
             />
             
             <SubjectCard 
               title="English"
               description="Unlock the power of communication. Reading, writing, grammar, and literature."
               icon={BookOpen}
               colorClass="text-teal-600"
               bgClass="bg-teal-50"
               link="#"
             />
             
             <SubjectCard 
               title="Science"
               description="Discover how the world works. Biology, Chemistry, Physics, and Earth Science."
               icon={FlaskConical}
               colorClass="text-orange-600"
               bgClass="bg-orange-50"
               link="#"
             />
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-400/20">
                   <Target size={18} strokeWidth={3} />
                </div>
                <h4 className="font-bold text-2xl tracking-tight">Questerix</h4>
             </div>
             <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
               Empowering students worldwide with accessible, high-quality education technology.
             </p>
           </div>
           
           <div className="col-span-1 md:col-span-1">
             <h5 className="font-bold mb-6 text-gray-200">Platform</h5>
             <ul className="space-y-4 text-gray-400">
               <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
             </ul>
           </div>
           
           <div className="col-span-1 md:col-span-1">
             <h5 className="font-bold mb-6 text-gray-200">Get the App</h5>
             <ul className="space-y-4 text-gray-400">
               <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Download for iOS</a></li>
               <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Download for Android</a></li>
             </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center md:text-left text-gray-500 text-sm flex justify-between items-center">
          <p>© 2024 Questerix Inc. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
