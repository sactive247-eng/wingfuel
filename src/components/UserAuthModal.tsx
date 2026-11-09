import React, { useState } from 'react';
import { User, X, Mail, Lock, ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || 'Aviation Member',
          photoURL: res.user.photoURL || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
        onClose();
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim() && res.user) {
          await updateProfile(res.user, { displayName: displayName.trim() });
        }
        if (res.user) {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
            displayName: displayName.trim() || 'Aviation Member',
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-slate-900 dark:text-slate-100 space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">
            {mode === 'signup' ? 'Create WingFuel Account' : 'Sign In to WingFuel'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signup' 
              ? 'Join 50,000+ aviation professionals for news alerts & tools' 
              : 'Access your saved bookmarks, alerts, and digital downloads'}
          </p>
        </div>

        {/* Google Quick Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center text-[10px] uppercase font-bold text-slate-400 my-2">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 shrink-0">or with email</span>
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Capt. Ramesh Sharma"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aviation.pro@company.com"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" /> Create Free Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-orange-500 font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button onClick={() => setMode('signup')} className="text-orange-500 font-bold hover:underline">
                Sign Up Free
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
