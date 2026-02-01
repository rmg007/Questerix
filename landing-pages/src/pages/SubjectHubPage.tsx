import type { Database } from '../lib/database.types';

type SubjectData = Database['public']['Tables']['subjects']['Row'];

export const SubjectHubPage = ({ subject }: { subject: SubjectData | null }) => {
  const color = subject?.color_hex || '#3B82F6';
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header style={{ backgroundColor: color }} className="text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
             <h1 className="text-3xl font-bold">{subject?.name || 'Subject'} Hub</h1>
             <a href="/" className="text-white opacity-80 hover:opacity-100">← Back to Subjects</a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-8">
        <div className="py-12 text-center">
             <h2 className="text-4xl font-bold mb-4 text-gray-900" style={{ color: color }}>Master {subject?.name} at Every Level</h2>
             <p className="text-xl text-gray-600">Explore our comprehensive curriculum designed to build confidence.</p>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Choose Your Grade Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
             <a 
               key={grade} 
               href="#" 
               className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-center group"
             >
               <span className="font-semibold text-lg text-gray-700 group-hover:text-blue-600">
                  {grade === 0 ? 'Kindergarten' : `${grade}${getOrdinal(grade)} Grade`}
               </span>
               <span className="text-gray-300 group-hover:text-blue-500">→</span>
             </a>
          ))}
        </div>
      </main>
    </div>
  );
};

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
