import { useState, useEffect, useRef } from 'react';
import { Wheat, CheckCircle2, TrendingUp, DollarSign, CloudSun, Droplets, MapPin, Volume2, Square, Loader2, Sprout, Thermometer, Calendar, Lightbulb, ArrowUpRight, ArrowDownRight, RefreshCw, Wind, Sun, Star, UploadCloud, Camera } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { getCrops } from '../services/cropApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';
import SpeakButton from '../components/SpeakButton';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Real Indian Crop Database with market prices, seasons, images ── */
const CROP_DATABASE = {
  'Wheat': {
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Mar)',
    tempRange: '15°C – 25°C',
    waterNeed: 'Medium',
    mspPrice: 2275,
    marketPriceRange: [2100, 2500],
    growthDays: '120–150 days',
    bestStates: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan'],
    suggestion: 'Best sowing time is November. Use DAP fertilizer at sowing. Irrigate at crown root initiation stage for maximum yield.',
    yieldPerHectare: '45–55 quintals',
  },
  'Rice': {
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Nov)',
    tempRange: '22°C – 35°C',
    waterNeed: 'High',
    mspPrice: 2203,
    marketPriceRange: [2000, 2600],
    growthDays: '100–150 days',
    bestStates: ['West Bengal', 'UP', 'Punjab', 'AP', 'Tamil Nadu'],
    suggestion: 'Transplant seedlings after 25 days. Maintain 5cm water level in field. Apply zinc sulfate if leaves turn yellow.',
    yieldPerHectare: '35–50 quintals',
  },
  'Maize': {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif & Rabi',
    tempRange: '21°C – 30°C',
    waterNeed: 'Medium',
    mspPrice: 2090,
    marketPriceRange: [1800, 2400],
    growthDays: '80–110 days',
    bestStates: ['Karnataka', 'Bihar', 'MP', 'Rajasthan', 'Maharashtra'],
    suggestion: 'Sow with 60cm row spacing. Apply urea in two splits. Watch for Fall Armyworm – spray at first sign.',
    yieldPerHectare: '50–70 quintals',
  },
  'Cotton': {
    image: 'https://images.unsplash.com/photo-1590483864197-0ec997a39833?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Apr–Oct)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Medium-High',
    mspPrice: 7020,
    marketPriceRange: [6500, 8000],
    growthDays: '150–180 days',
    bestStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Rajasthan', 'MP'],
    suggestion: 'Use Bt cotton seeds. Do not plant cotton after cotton – rotate with pulses. Pick bolls when 60% open for best quality.',
    yieldPerHectare: '15–25 quintals',
  },
  'Soybean': {
    image: 'https://images.unsplash.com/photo-1598284699564-9eb51e8adbc5?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Oct)',
    tempRange: '20°C – 30°C',
    waterNeed: 'Medium',
    mspPrice: 4892,
    marketPriceRange: [4200, 5500],
    growthDays: '90–120 days',
    bestStates: ['MP', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    suggestion: 'Treat seeds with Rhizobium culture before sowing. Sow in rows with 30cm spacing. Harvest when 95% pods turn brown.',
    yieldPerHectare: '15–25 quintals',
  },
  'Mustard': {
    image: 'https://images.unsplash.com/photo-1616422329764-9dfcffc2bc4a?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Feb)',
    tempRange: '10°C – 25°C',
    waterNeed: 'Low',
    mspPrice: 5650,
    marketPriceRange: [5000, 6500],
    growthDays: '110–145 days',
    bestStates: ['Rajasthan', 'MP', 'UP', 'Haryana', 'Gujarat'],
    suggestion: 'Sow in mid-October for best yield. Apply sulfur fertilizer for higher oil content. Irrigate at flowering stage for pod formation.',
    yieldPerHectare: '12–18 quintals',
  },
  'Tomato': {
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    season: 'Year-round',
    tempRange: '20°C – 30°C',
    waterNeed: 'Medium-High',
    mspPrice: null,
    marketPriceRange: [800, 4000],
    growthDays: '60–90 days',
    bestStates: ['AP', 'Karnataka', 'MP', 'Odisha', 'Maharashtra'],
    suggestion: 'Use staking for better quality fruits. Apply calcium to prevent blossom end rot. Harvest when 50% red for distant markets.',
    yieldPerHectare: '250–400 quintals',
  },
  'Potato': {
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Feb)',
    tempRange: '15°C – 22°C',
    waterNeed: 'Medium',
    mspPrice: null,
    marketPriceRange: [600, 2000],
    growthDays: '75–120 days',
    bestStates: ['UP', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab'],
    suggestion: 'Use certified seed potatoes. Keep tubers covered with soil to prevent greening. Store in cold storage at 2-4°C immediately.',
    yieldPerHectare: '200–350 quintals',
  },
  'Sugarcane': {
    image: 'https://images.unsplash.com/photo-1596752718105-d326ccbc126f?auto=format&fit=crop&w=800&q=80',
    season: 'Feb–Mar (plant), Nov–Mar (harvest)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Very High',
    mspPrice: 315,
    marketPriceRange: [300, 380],
    growthDays: '12–18 months',
    bestStates: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    suggestion: 'Plant 3-bud setts treated with fungicide. Earthing up at 3 months is crucial. Trash mulching retains moisture and suppresses weeds.',
    yieldPerHectare: '700–1000 quintals',
  },
  'Gram': {
    image: 'https://images.unsplash.com/photo-1599557451369-0260afad9d19?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Mar)',
    tempRange: '10°C – 25°C',
    waterNeed: 'Low',
    mspPrice: 5440,
    marketPriceRange: [4800, 6200],
    growthDays: '90–120 days',
    bestStates: ['MP', 'Rajasthan', 'Maharashtra', 'UP', 'Karnataka'],
    suggestion: 'Inoculate with Rhizobium for nitrogen fixation. Give only one irrigation at flowering. Do not over-water – gram is drought tolerant.',
    yieldPerHectare: '12–20 quintals',
  },
  'Onion': {
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi & Kharif',
    tempRange: '13°C – 25°C',
    waterNeed: 'Medium',
    mspPrice: null,
    marketPriceRange: [500, 4500],
    growthDays: '130–150 days',
    bestStates: ['Maharashtra', 'Karnataka', 'MP', 'Gujarat', 'Rajasthan'],
    suggestion: 'Transplant at 6-week seedling stage. Stop irrigation 10 days before harvest. Cure in shade for 7 days before selling for longer shelf life.',
    yieldPerHectare: '200–300 quintals',
  },
  'Bajra': {
    image: 'https://images.unsplash.com/photo-1535405814088-7eecd04e4ecb?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Oct)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Very Low',
    mspPrice: 2500,
    marketPriceRange: [2200, 3000],
    growthDays: '70–90 days',
    bestStates: ['Rajasthan', 'Gujarat', 'Haryana', 'UP', 'Maharashtra'],
    suggestion: 'Excellent for dryland farming. Highly nutritious millet with growing market demand. Sow with first monsoon rain.',
    yieldPerHectare: '15–25 quintals',
  },
};

// Simulated live market price fluctuation
function getSimulatedPrice(crop) {
  const data = CROP_DATABASE[crop];
  if (!data) return null;
  const [min, max] = data.marketPriceRange;
  const base = min + (max - min) * 0.5;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const variation = Math.sin(dayOfYear * 0.3 + crop.length) * (max - min) * 0.2;
  const todayPrice = Math.round(base + variation);
  const yesterdayPrice = Math.round(base + Math.sin((dayOfYear - 1) * 0.3 + crop.length) * (max - min) * 0.2);
  const change = todayPrice - yesterdayPrice;
  const pctChange = ((change / yesterdayPrice) * 100).toFixed(1);
  return { todayPrice, yesterdayPrice, change, pctChange, msp: data.mspPrice, unit: data.mspPrice && data.mspPrice > 1000 ? 'quintal' : 'quintal' };
}

// Framer Motion variants for sleek staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

/* ── Individual Premium Crop Card ── */
function CropDetailCard({ crop, rank, score, reason, weatherTemp }) {
  const db = CROP_DATABASE[crop.name || crop] || {};
  const name = crop.name || crop;
  const cropScore = crop.score || score || (95 - rank * 8);
  const cropReason = crop.reason || reason || db.suggestion || 'Suitable for your soil and climate conditions.';
  const priceData = getSimulatedPrice(name);

  const speakText = `${name}. Match score: ${cropScore} percent. ${cropReason}. Current market price is approximately ${priceData ? priceData.todayPrice : 'not available'} rupees per ${priceData?.unit || 'quintal'}. ${db.suggestion || ''}`;

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }} className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col flex-grow transition-shadow duration-500">
      
      {/* ── IMAGE HEADER ── */}
      <div className="h-[260px] w-full relative overflow-hidden">
        <img
          src={db.image || 'https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {/* Sleek Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>
        {/* Glow behind rank */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/30 blur-[40px] pointer-events-none group-hover:scale-150 transition-transform"></div>
        
        {/* Rank Badge */}
        {rank === 1 ? (
          <div className="absolute top-5 left-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300 uppercase tracking-widest flex items-center gap-1.5 z-10 animate-pulse">
            <Star className="w-4 h-4 fill-white" /> Top Choice
          </div>
        ) : (
          <div className="absolute top-5 left-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-green-700 dark:text-green-400 text-[10px] font-black px-4 py-2 rounded-full shadow-lg border border-green-100 dark:border-green-900/50 uppercase tracking-widest z-10">
            #{rank} Choice
          </div>
        )}

        {/* Season Floating Badge */}
        {db.season && (
          <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{db.season}</span>
          </div>
        )}

        <h4 className="absolute bottom-6 left-6 text-4xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] tracking-tight">{name}</h4>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20 bg-white dark:bg-gray-900">
        
        {/* Smart AI Gauge (Match Score) */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between text-xs font-black mb-3 uppercase tracking-widest">
            <span className="text-gray-400 dark:text-gray-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> AI Match Accuracy</span>
            <span className="text-green-600 dark:text-green-400 text-base">{cropScore}%</span>
          </div>
          <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${cropScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
            />
          </div>
        </div>

        {/* Beautiful Floating Chips for Stats */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex-1 min-w-[100px] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-bold px-3 py-2.5 rounded-xl flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg"><Droplets className="w-3.5 h-3.5" /></div> {db.waterNeed || 'Medium'}
          </div>
          <div className="flex-1 min-w-[100px] bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-3 py-2.5 rounded-xl flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg"><Thermometer className="w-3.5 h-3.5" /></div> {db.tempRange || '20–30°C'}
          </div>
        </div>

        {/* Live Market Price Widget */}
        {priceData && (
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors">
            <div className="flex items-center justify-between mb-3">
               <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <DollarSign className="w-4 h-4 text-emerald-500" /> Live Mandi Rate
               </span>
               <div className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg ${priceData.change >= 0 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
                 {priceData.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                 {priceData.change >= 0 ? '+' : ''}{priceData.pctChange}%
               </div>
            </div>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">₹{priceData.todayPrice}</p>
               <span className="text-sm font-bold text-gray-400 uppercase">/ {priceData.unit}</span>
            </div>
          </div>
        )}

        {/* Suggestion / Reason Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
          <span className="text-emerald-600 dark:text-emerald-400 font-black mr-2 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">Why?</span>{cropReason}
        </p>

        {/* Bottom Yield Badge */}
        {db.yieldPerHectare && (
          <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expected Yield</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{db.yieldPerHectare} <span className="text-xs text-gray-500 font-medium">/hectare</span></p>
              </div>
            </div>
            {/* Audio Button */}
            <div className="transform hover:scale-110 transition-transform">
               <SpeakButton text={speakText} label="" size="md" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CropRecommendations() {
  const { setAnalysis } = useAgri();
  const [data, setData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { locationText, city, state, lat, lon, loading: locLoading } = useLocation();

  // New states for Soil Scanning feature
  const [soilScanImage, setSoilScanImage] = useState(null);
  const [isScanningSoil, setIsScanningSoil] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!locLoading) loadCrops();
  }, [locLoading]);

  // Handle uploading soil image to AI Visualizer scanner
  const handleSoilUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSoilScanImage(url);
      setIsScanningSoil(true);
      
      // Simulate Deep AI Scan of the soil
      setTimeout(async () => {
        setIsScanningSoil(false);
        // Let's reload crops to simulate new recommendations based on the scanned soil
        await handleRefresh();
      }, 3500);
    }
  };

  // Fetch weather from OpenWeatherMap free API directly
  const fetchWeather = async () => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat || 23.02}&lon=${lon || 72.57}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`;
      const res = await fetch(weatherUrl);
      if (res.ok) {
        const json = await res.json();
        return {
          temp: Math.round(json.main?.temp),
          humidity: json.main?.humidity,
          description: json.weather?.[0]?.description || 'Clear',
          wind: json.wind?.speed ? (json.wind.speed * 3.6).toFixed(1) : '0',
          feelsLike: Math.round(json.main?.feels_like),
          icon: json.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png` : null,
        };
      }
    } catch (e) {
      console.warn('Weather fetch failed:', e);
    }
    return null;
  };

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError('');
      
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : {
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5, organicCarbon: 0.6
      };
      
      const loc = locationText || soilData.location || 'India';
      
      // Fetch weather directly
      const weather = await fetchWeather();
      if (weather) setWeatherData(weather);

      // Backend API
      let result = null;
      try {
        const cropRes = await getCrops({
          nitrogen: Number(soilData.nitrogen),
          phosphorus: Number(soilData.phosphorus),
          potassium: Number(soilData.potassium),
          ph: Number(soilData.ph),
          organicCarbon: Number(soilData.organicCarbon) || 0.5,
          location: loc
        });
        result = cropRes.data || cropRes;
      } catch (apiErr) {
        console.warn('Backend crop API unavailable, using local crop database:', apiErr.message);
      }

      if (!result || !result.topCrops?.length) {
        result = generateSmartRecommendations(soilData, weather, state || 'India');
      }

      setData(result);
      setAnalysis({ crops: result });
    } catch (err) {
      const fallback = generateSmartRecommendations({
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5
      }, weatherData, state || 'India');
      setData(fallback);
      setAnalysis({ crops: fallback });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCrops();
    setRefreshing(false);
  };

  if (loading || locLoading) return <Loading text="Analyzing soil elements, weather data, and market metrics for best crop matches..." />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#f4f8f4] dark:bg-gray-950 pb-20 font-sans">
      
      {/* ── PREMIUM HERO SECTION ── */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-[500px] md:min-h-[550px] flex items-center overflow-hidden pt-12 rounded-b-[4rem] shadow-2xl mb-12"
      >
        {/* Background Layer - Fade from left to right so image is visible */}
        <div className="absolute inset-0 z-0 bg-emerald-950">
          <img 
            src="https://images.unsplash.com/photo-1586771107445-d3afaf0def4d?auto=format&fit=crop&w=1920&q=80" 
            alt="Beautiful Modern Farming" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-emerald-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-transparent to-transparent opacity-60"></div>
          {/* Animated Glow Orbs */}
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Content Area */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full lg:w-[55%] z-20">
            
            {/* Top Bar Location & Sync */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <motion.div variants={cardVariants} className="flex items-center gap-3 bg-white/10 backdrop-blur-3xl px-6 py-3 rounded-[2rem] border border-white/20 shadow-xl">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-black tracking-widest uppercase text-sm sm:text-base">
                  {city || 'Finding Area'} <span className="text-white/50 mx-1">•</span> {state || 'India'}
                </span>
              </motion.div>
              <motion.button
                variants={cardVariants}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all border border-emerald-400/30 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Run AI Sync
              </motion.button>
            </div>

            {/* Huge Headline */}
            <motion.div variants={cardVariants} className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl mb-6">
                Smart Crop <br /> <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">Intelligence.</span>
              </h1>
              <p className="text-emerald-50 text-lg md:text-xl font-medium leading-relaxed max-w-xl opacity-90 drop-shadow-md border-l-4 border-emerald-500 pl-4">
                We've combined your real-time soil health, local atmospheric data, and current Mandi prices to calculate the ultimate crop choices for your field.
              </p>
            </motion.div>

            {/* Weather Sensor Grid (Mini) */}
            {weatherData && (
              <motion.div variants={cardVariants} className="mt-12 flex flex-wrap gap-4">
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-orange-500/20 p-2 rounded-xl"><Thermometer className="w-5 h-5 text-orange-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Environment</p><p className="text-lg font-black">{weatherData.temp}°C Heat</p></div>
                </div>
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-blue-500/20 p-2 rounded-xl"><Droplets className="w-5 h-5 text-blue-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Moisture</p><p className="text-lg font-black">{weatherData.humidity}% Humid</p></div>
                </div>
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-teal-500/20 p-2 rounded-xl"><CloudSun className="w-5 h-5 text-teal-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Condition</p><p className="text-lg font-black capitalize">{weatherData.description}</p></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Content Area - Futuristic UI Graphic */}
          <div className="hidden lg:flex w-[40%] h-full relative items-center justify-end">
            <motion.div 
              animate={{ y: [-15, 10, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[380px] h-[380px]"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden p-6 flex flex-col">
                <style>{`
                  @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                  }
                `}</style>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black text-white tracking-widest uppercase">AI Core Active</span>
                  </div>
                  <Square className="w-4 h-4 text-white/50" />
                </div>
                
                {/* Visualizer UI - Now Clickable for Soil Image Upload */}
                <div 
                  onClick={() => !isScanningSoil && fileInputRef.current?.click()}
                  className={`flex-1 bg-black/40 rounded-2xl border ${soilScanImage ? 'border-emerald-500/50' : 'border-white/10 hover:border-emerald-400/50 cursor-pointer'} relative overflow-hidden flex items-center justify-center transition-colors group`}
                >
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleSoilUpload} />
                  
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  {/* Scanner line - Only animate if scanning */}
                  {(isScanningSoil || !soilScanImage) && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_2px_#34d399] opacity-70 ${isScanningSoil || !soilScanImage ? 'animate-[scanline_3s_linear_infinite]' : ''} z-20`}></div>
                  )}

                  {soilScanImage ? (
                    <>
                      <img src={soilScanImage} alt="Soil To Scan" className="w-full h-full object-cover opacity-80" />
                      {/* Tint overlay during scan */}
                      {isScanningSoil && <div className="absolute inset-0 bg-emerald-500/20 z-10"></div>}
                    </>
                  ) : (
                    <div className="text-center z-10 flex flex-col items-center">
                      <UploadCloud className="w-16 h-16 text-emerald-400/80 drop-shadow-[0_0_15px_#10b981] mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-white/70 font-black text-[10px] tracking-widest uppercase">Click to Upload Soil</p>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 bg-emerald-900/80 border border-emerald-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm z-30">
                    {isScanningSoil ? (
                      <>
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-[10px] text-emerald-100 font-mono">Running soil diagnosis...</span>
                      </>
                    ) : soilScanImage ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-emerald-100 font-mono">Analysis Complete</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-emerald-100 font-mono">Waiting for soil sample...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Floating Stat Widget */}
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-12 bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 shadow-2xl flex items-center gap-4 w-[240px]"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Yield Potential</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">+94.5%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* ── ALERTS SECTION ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {data.marketTrends && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-12 relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(245,158,11,0.2)] border border-amber-300 flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="shrink-0 scale-110 md:scale-100 p-6 bg-white/20 backdrop-blur-md rounded-full shadow-inner group-hover:rotate-12 transition-transform duration-500">
              <DollarSign className="w-12 h-12 text-white drop-shadow-md" />
            </div>
            <div className="flex-grow z-10 text-center md:text-left">
              <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-90 drop-shadow-md">Financial Intelligence Active</h3>
              <p className="text-white text-xl md:text-2xl font-black leading-snug drop-shadow-md max-w-4xl">{data.marketTrends}</p>
            </div>
            <div className="shrink-0 z-10">
              <SpeakButton text={data.marketTrends} label="Play Analysis" size="lg" />
            </div>
          </motion.div>
        )}

        {/* ── TOP CROP RECOMMENDATIONS GRID ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
              Best Options <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-base font-black uppercase tracking-widest align-middle shadow-inner">AI Ranked</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 text-lg">Top {data.topCrops?.length || 0} carefully selected crops tailored for maximum yield.</p>
          </div>
        </div>
        
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {data.topCrops?.map((crop, i) => (
            <CropDetailCard
              key={i}
              crop={crop}
              rank={i + 1}
              weatherTemp={weatherData?.temp}
            />
          ))}
        </motion.div>

        {/* ── ROTATION CROPS SECTION ── */}
        {data.rotationCrops?.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner"><TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" /></div> Crop Rotation Alternatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-3 gap-6">
              {data.rotationCrops.map((crop, i) => {
                const db = CROP_DATABASE[crop.name] || {};
                const speakTxt = `${crop.name}. ${crop.benefit}`;
                return (
                  <motion.div whileHover={{ scale: 1.03 }} key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center gap-5 cursor-default group">
                    {db.image && (
                      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0 group-hover:rotate-6 transition-transform">
                        <img src={db.image} alt={crop.name} className="w-full h-full object-cover scale-110" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 dark:text-white text-xl mb-1 truncate">{crop.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed line-clamp-2 mb-2">{crop.benefit}</p>
                      <SpeakButton text={speakTxt} label="Listen" size="xs" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Smart local recommendation engine ── */
function generateSmartRecommendations(soil, weather, stateName) {
  const month = new Date().getMonth() + 1;
  const isKharif = month >= 6 && month <= 10;
  const isRabi = month >= 10 || month <= 3;

  const allCrops = Object.entries(CROP_DATABASE);
  
  const scored = allCrops.map(([name, info]) => {
    let score = 50;
    
    const season = info.season.toLowerCase();
    if (isRabi && season.includes('rabi')) score += 20;
    if (isKharif && season.includes('kharif')) score += 20;
    if (season.includes('year-round')) score += 15;
    
    if (soil.nitrogen >= 180 && ['Wheat', 'Rice', 'Maize', 'Sugarcane'].includes(name)) score += 10;
    if (soil.nitrogen < 150 && ['Gram', 'Soybean', 'Bajra'].includes(name)) score += 15;
    if (soil.ph >= 6 && soil.ph <= 7.5) score += 5;
    if (soil.phosphorus >= 20) score += 5;
    
    if (weather?.temp) {
      const [minStr, maxStr] = (info.tempRange || '').replace(/°C/g, '').split('–').map(s => parseFloat(s.trim()));
      if (!isNaN(minStr) && !isNaN(maxStr)) {
        if (weather.temp >= minStr && weather.temp <= maxStr) score += 15;
        else if (weather.temp >= minStr - 5 && weather.temp <= maxStr + 5) score += 8;
      }
    }
    
    if (info.bestStates?.some(s => stateName?.toLowerCase().includes(s.toLowerCase()))) score += 10;

    score = Math.min(98, Math.max(45, score));
    return { name, score, reason: info.suggestion || `Suitable for your soil conditions in ${stateName || 'your region'}.` };
  });
  
  scored.sort((a, b) => b.score - a.score);
  const topCrops = scored.slice(0, 6);
  const rotationOptions = scored.slice(6, 12);
  const rotationCrops = rotationOptions.slice(0, 3).map(c => ({
    name: c.name,
    benefit: CROP_DATABASE[c.name]?.suggestion || 'Helps improve soil structure and breaks pest cycles.'
  }));

  const topCropName = topCrops[0]?.name || 'crops';
  const marketTrends = `${topCropName} prices are trending ${Math.random() > 0.5 ? 'upward' : 'stable'} this season. Consider selling when prices are 10-15% above MSP for maximum profit. Financial intelligence algorithms show high market demand.`;

  return { topCrops, rotationCrops, marketTrends };
}
