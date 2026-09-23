import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('vasuvani2125@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSentMessage, setResetSentMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSentMessage(null);

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUpMode) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      onLoginSuccess();
    } catch (err: unknown) {
      console.error('Firebase Auth error:', err);
      const authError = err as { code?: string; message?: string };
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No admin account found with this email. Click "Create Admin Account" below to register.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Incorrect password or credentials. Please check and try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account already exists with this email. Please switch to "Sign In" mode.');
          break;
        case 'auth/invalid-email':
          setError('Please provide a valid email format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          break;
        default:
          setError(authError.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email above to receive a password reset link.');
      return;
    }
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setResetSentMessage(`Password reset link sent to ${email}. Check your inbox.`);
      setError(null);
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      setError(authErr.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8DFC8] shadow-xl overflow-hidden animate-fadeIn">
        {/* Header with Devotional Burgundy Branding */}
        <div className="bg-gradient-to-br from-[#6B1724] to-[#450C14] text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <span className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] block">
            Hari Travels Dispatch Portal
          </span>
          <h2 className="font-display text-2xl font-bold mt-1">
            Admin Authentication
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            Secure login for dispatch managers to review, approve, and manage customer rides in Firestore.
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSentMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{resetSentMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@haritravels.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Password
                </label>
                {!isSignUpMode && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-[#6B1724] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password (min 6 chars)"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#6B1724] to-[#801B2B] hover:from-[#58111A] hover:to-[#6B1724] text-white shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>{isSignUpMode ? 'Register New Admin Account' : 'Sign In to Admin Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-5 pt-4 border-t border-stone-200 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setError(null);
              }}
              className="text-xs text-stone-600 hover:text-[#6B1724] font-medium"
            >
              {isSignUpMode ? (
                <span>Already have an account? <strong className="text-[#6B1724]">Sign In here</strong></span>
              ) : (
                <span>First time setting up? <strong className="text-[#6B1724]">Create Admin Account</strong></span>
              )}
            </button>
          </div>

          {/* Quick preset helper for the user's email */}
          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D28]" />
              <span>Quick Dispatcher Access:</span>
            </div>
            <p className="leading-snug">
              Pre-authorized for <strong>vasuvani2125@gmail.com</strong>. You can register your admin password on first login to start managing rides.
            </p>
          </div>

          {onCancel && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                ← Return to Public Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
