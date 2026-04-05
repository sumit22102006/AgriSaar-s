import { useState } from 'react';
import { Users, Search, MessageSquare, Heart, Share2, Award, TrendingUp, Filter, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_POSTS = [
  {
    id: 1,
    user: 'Ramesh Patel',
    district: 'Ahmedabad',
    time: '2 hours ago',
    content: 'Dosto, kya kisi ne "Jeevamrut" is season me try kiya? Wheat ki growth me kafi farak dikh raha hai. Any suggestions on quantity?',
    likes: 45,
    comments: 12,
    tags: ['Organic', 'Wheat'],
    avatar: 'RP'
  },
  {
    id: 2,
    user: 'Sunita Devi',
    district: 'Karnal',
    time: '5 hours ago',
    content: 'Karnal mandi me aaj Rice ka rate ₹3100 chal raha hai. Kya koi bata sakta hai ki kal ke prices upar jayenge?',
    likes: 28,
    comments: 8,
    tags: ['Market', 'Rice'],
    avatar: 'SD'
  },
  {
    id: 3,
    user: 'Ajay Kumar',
    district: 'Pune',
    time: 'Yesterday',
    content: 'Tomato ki fasal me thodi keede (pest) lag rahe hain. Organic Neem-Astra kaam karega ya chemical spray karun?',
    likes: 15,
    comments: 24,
    tags: ['Pest Control', 'Tomato'],
    avatar: 'AK'
  }
];

const TOP_CONTRIBUTORS = [
  { name: 'Dr. Sharma', role: 'Agriculture Expert', points: 15400, avatar: 'DS' },
  { name: 'Vijay Bhai', role: 'Master Farmer', points: 12200, avatar: 'VB' },
  { name: 'Kiran G.', role: 'Success Story', points: 9800, avatar: 'KG' }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('My District');
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans pb-20">
      
      {/* --- Community Hero --- */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-[#0A2E0D]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500 rounded-full blur-[120px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/30 mb-6">
              <Users className="w-4 h-4" /> AgriSaar Community
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Kisan-Se-Kisan <span className="text-green-400">Samvaad</span></h1>
            <p className="text-green-100/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Join thousands of farmers across {selectedDistrict}. Share knowledge, compare rates, and grow together.
            </p>

            <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-y-0 left-5 flex items-center">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search topics, questions, or fellow farmers..." 
                className="w-full bg-white/10 border border-white/20 backdrop-blur-3xl rounded-full py-4 pl-14 pr-6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-bold"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Districts/Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <MapPin className="w-4 h-4" /> Districts
              </h3>
              <div className="space-y-2">
                {['Ahmedabad', 'Surat', 'Rajkot', 'Karnal', 'Pune', 'Nashik'].map(dist => (
                  <button 
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedDistrict === dist 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl">
              <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
              <h3 className="text-xl font-black mb-2">Build Trust</h3>
              <p className="text-green-50 text-sm font-medium mb-4">Answering questions earns you AgriCoins & Expert Badges.</p>
              <button className="bg-white text-green-700 w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-50 transition-colors">
                Kisaan Helpline
              </button>
            </div>
          </div>

          {/* Feed Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['My District', 'Global Feed', 'Market Talk', 'Organic', 'Equipment'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeTab === tab 
                      ? 'bg-white shadow-md border-green-200 text-green-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white' 
                      : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Create Post Mock */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 shrink-0">ME</div>
               <button className="flex-1 text-left bg-slate-50 dark:bg-gray-800 py-3 px-5 rounded-2xl text-gray-500 font-bold hover:bg-slate-100 transition-colors">
                  Ask the community something...
               </button>
               <button className="p-3 bg-green-500 rounded-2xl text-white hover:bg-green-600 transition-colors">
                  <Plus className="w-5 h-5" />
               </button>
            </div>

            {/* Posts */}
            <AnimatePresence mode="popLayout">
              {MOCK_POSTS.map((post, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={post.id} 
                  className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black">
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 dark:text-white leading-tight">{post.user}</h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">📍 {post.district} · {post.time}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-lg">
                      <Award className="w-5 h-5 text-amber-500" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-base leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-slate-50 dark:bg-gray-800 text-[10px] font-black text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">#{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-black">
                        <Heart className="w-5 h-5" /> <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-black">
                        <MessageSquare className="w-5 h-5" /> <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Trending/Experts */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                 Top Contributors <Award className="w-4 h-4 text-amber-500" />
              </h3>
              <div className="space-y-6">
                {TOP_CONTRIBUTORS.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">{c.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{c.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{c.role}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-green-600 dark:text-green-400">{c.points.toLocaleString()}</p>
                       <p className="text-[8px] text-gray-400 font-black uppercase">Points</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 border-2 border-slate-100 dark:border-gray-800 rounded-xl text-xs font-black text-gray-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
                View Leaderboard
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1595067331635-f04ed413b7ca?w=600&q=80" alt="Success story" className="h-40 w-full object-cover rounded-2xl mb-4" />
               <div className="p-4 pt-0 text-center">
                  <h4 className="font-black text-sm text-gray-900 dark:text-white mb-2">Success Story: 5x Profit</h4>
                  <p className="text-xs text-gray-500 font-medium mb-3">Kiran G. from Nashik sharing his Grapes farming secrets.</p>
                  <button className="text-xs font-black text-green-600 dark:text-green-400 underline uppercase tracking-widest">Watch Story</button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
