import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sprout, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in! Welcome back, Kisaan!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      // Browser redirects to Google — no code runs after this for real Supabase
      // For demo mode, googleLogin resolves immediately:
    } catch (error) {
      console.error(error);
      toast.error('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 relative overflow-hidden bg-[#f0f4f0] dark:bg-gray-950 transition-colors duration-500">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary-200 dark:bg-primary-800/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white dark:border-gray-800 p-6 rounded-3xl shadow-2xl shadow-primary-900/10 transition-colors">
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none mb-3 rotate-3 hover:rotate-0 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Kisan Login</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Welcome back to AgriSaar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:border-gray-700" />
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-400">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="px-3 bg-white dark:bg-gray-900 text-gray-500 font-bold tracking-widest transition-colors">Or continue with</span></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-sm text-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
              Sign in with Google
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
            New to AgriSaar?{' '}
            <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-bold hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
