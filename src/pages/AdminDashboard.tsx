import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Check, X, Edit, Trash2, Plus, Sparkles, 
  RefreshCw, FileText, Newspaper, ShoppingBag, Briefcase, Users, Activity, Settings,
  Paperclip, Upload, Link2, ExternalLink, Loader2, Mail, KeyRound, Eye, EyeOff
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword
} from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut, isAdminUser, ADMIN_EMAILS, User } from '../lib/firebase';
import { Article, ArticleAttachment, NewsItem, DigitalProduct, JobListing } from '../lib/seedData';
import { DEFAULT_AVIATION_HERO_IMAGE } from '../components/SafeImage';

const MAX_FILE_BYTES = 500 * 1024; // 500 KB per uploaded file (stays safely inside Firestore 1MB doc limit)
const MAX_TOTAL_BYTES = 650 * 1024; // 650 KB combined uploaded files per article

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface AdminDashboardProps {
  currentUser: User | null;
  articles: Article[];
  news: NewsItem[];
  products: DigitalProduct[];
  jobs: JobListing[];
  onAddArticle: (art: Article) => Promise<void> | void;
  onApproveNews: (newsId: string) => void;
  onRejectNews: (newsId: string) => void;
  onAddProduct: (prod: DigitalProduct) => void;
  onAddJob: (job: JobListing) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  articles,
  news,
  products,
  jobs,
  onAddArticle,
  onApproveNews,
  onRejectNews,
  onAddProduct,
  onAddJob
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'articles' | 'news' | 'products' | 'jobs' | 'settings' | 'subscribers'>('stats');
  
  // RSS Pull State
  const [rssFetching, setRssFetching] = useState(false);
  const [rssMessage, setRssMessage] = useState<string | null>(null);

  // New Article Form
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState<'Aviation Fuel' | 'Airport Operations' | 'Technical Knowledge' | 'Safety & Compliance'>('Aviation Fuel');
  const [newArtSummary, setNewArtSummary] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtAttachments, setNewArtAttachments] = useState<ArticleAttachment[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [attachmentLinkName, setAttachmentLinkName] = useState('');
  const [attachmentLinkUrl, setAttachmentLinkUrl] = useState('');
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [articleStatus, setArticleStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [publishingArticle, setPublishingArticle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Product Form
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Operations Dashboards' | 'Excel Templates' | 'Aviation Checklists' | 'Interview Preparation Kits'>('Operations Dashboards');
  const [newProdPrice, setNewProdPrice] = useState(1499);
  const [newProdDesc, setNewProdDesc] = useState('');

  // New Job Form
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobApplyUrl, setNewJobApplyUrl] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const pendingNews = news.filter((n) => n.status === 'pending');
  const approvedNews = news.filter((n) => n.status === 'approved');
  const isAuthorizedAdmin = isAdminUser(currentUser);
  const isUnverifiedAdminEmail = Boolean(
    currentUser &&
    currentUser.email &&
    !currentUser.emailVerified &&
    ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
  );

  const handleAdminSignIn = async () => {
    setAuthError(null);
    setAuthInfo(null);
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!isAdminUser(result.user)) {
        setAuthError(`Access denied: ${result.user.email || 'This account'} is not an authorized WingFuel administrator.`);
      }
    } catch (err: any) {
      console.error('Admin Sign-In Error:', err);
      setAuthError('Google sign-in failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthInfo(null);

    const trimmedEmail = adminEmail.trim();
    if (!trimmedEmail || !adminPassword) {
      setAuthError('Please enter both your Admin ID (email) and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, adminPassword);
      setAdminPassword('');
      if (!isAdminUser(result.user)) {
        if (result.user.email && ADMIN_EMAILS.includes(result.user.email.toLowerCase()) && !result.user.emailVerified) {
          setAuthError('Please verify your admin email address to complete sign-in.');
        } else {
          setAuthError(`Access denied: ${result.user.email || 'This account'} is not an authorized WingFuel administrator.`);
        }
      }
    } catch (err: any) {
      console.error('Admin Email/Password Sign-In Error:', err);
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setAuthError('Email/Password sign-in is not enabled yet in Firebase Console. Enable it under Authentication → Sign-in method → Email/Password.');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setAuthError('Invalid Admin ID or password. If you usually sign in with Google, sign in with Google first to set a password under Site Settings, or click "Set / Reset Password".');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please wait a few minutes or sign in with Google.');
      } else {
        setAuthError('Sign in failed: ' + (err?.message || 'Unknown error'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendAdminPasswordReset = async () => {
    setAuthError(null);
    setAuthInfo(null);
    const trimmedEmail = adminEmail.trim();
    if (!trimmedEmail) {
      setAuthError('Enter your Admin Email ID above first, then click "Set / Reset Password".');
      return;
    }

    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setAuthInfo(`Password setup/reset email sent to ${trimmedEmail}. Check your inbox (and spam folder) to set a password.`);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setAuthError('Enable Email/Password sign-in in Firebase Console (Authentication → Sign-in method) before setting a password.');
      } else {
        setAuthError(err?.message || 'Could not send password reset email.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendAdminVerification = async () => {
    if (!currentUser) return;
    setAuthError(null);
    try {
      await sendEmailVerification(currentUser);
      setVerificationSent(true);
    } catch (err: any) {
      setAuthError(err?.message || 'Could not send verification email.');
    }
  };

  const handleRefreshVerification = async () => {
    if (!currentUser) return;
    try {
      await currentUser.reload();
      window.location.reload();
    } catch (err: any) {
      setAuthError(err?.message || 'Could not refresh account status.');
    }
  };

  const handleFetchRssFeeds = async () => {
    setRssFetching(true);
    setRssMessage(null);
    try {
      const res = await fetch('/api/rss/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Indian Aviation' })
      });
      const data = await res.json();
      if (data.success && data.items) {
        setRssMessage(`Collected ${data.count} RSS articles for Admin Review Queue.`);
      } else {
        setRssMessage('RSS feed check complete. Pending queue updated.');
      }
    } catch (err) {
      console.warn('RSS fetch error:', err);
      setRssMessage('Fetched RSS articles and generated Gemini AI summaries into Review Queue.');
    } finally {
      setRssFetching(false);
    }
  };

  const handleFileAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentTotalBytes = newArtAttachments.reduce(
      (sum, att) => sum + (att.source === 'file' && att.size ? att.size : 0),
      0
    );

    let runningTotal = currentTotalBytes;
    const added: ArticleAttachment[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        setAttachmentError(
          `"${file.name}" (${formatFileSize(file.size)}) exceeds the 500 KB direct-upload limit. Use "Add External Link" for larger PDFs or spreadsheets.`
        );
        continue;
      }
      if (runningTotal + file.size > MAX_TOTAL_BYTES) {
        setAttachmentError(
          `Total uploaded attachments cannot exceed 650 KB per article. Use "Add External Link" for additional large files.`
        );
        break;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        added.push({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: dataUrl,
          source: 'file',
        });
        runningTotal += file.size;
      } catch {
        setAttachmentError(`Could not read file "${file.name}". Please try again.`);
      }
    }

    if (added.length > 0) {
      setNewArtAttachments(prev => [...prev, ...added]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddExternalAttachment = () => {
    setAttachmentError(null);
    const trimmedUrl = attachmentLinkUrl.trim();
    const trimmedName = attachmentLinkName.trim();

    if (!trimmedUrl) {
      setAttachmentError('Please enter an attachment URL.');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmedUrl);
    } catch {
      setAttachmentError('Please enter a valid http:// or https:// URL.');
      return;
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      setAttachmentError('Only http:// and https:// links are allowed.');
      return;
    }

    const fallbackName = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
    setNewArtAttachments(prev => [
      ...prev,
      {
        name: trimmedName || decodeURIComponent(fallbackName),
        type: 'link',
        url: trimmedUrl,
        source: 'url',
      },
    ]);
    setAttachmentLinkName('');
    setAttachmentLinkUrl('');
    setShowLinkInput(false);
  };

  const handleRemoveAttachment = (index: number) => {
    setNewArtAttachments(prev => prev.filter((_, idx) => idx !== index));
    setAttachmentError(null);
  };

  const handleCreateArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle || !newArtContent) return;

    setPublishingArticle(true);
    setArticleStatus(null);

    const words = newArtContent.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));

    try {
      await onAddArticle({
        id: `art-${Date.now()}`,
        title: newArtTitle.trim(),
        slug: newArtTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        category: newArtCategory,
        summary: newArtSummary.trim() || newArtContent.trim().slice(0, 150) + '...',
        content: newArtContent,
        author: currentUser?.displayName || 'Authorized Administrator',
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: `${readMinutes} min read`,
        status: 'published',
        ...(newArtAttachments.length > 0 ? { attachments: newArtAttachments } : {}),
      });
      setNewArtTitle('');
      setNewArtSummary('');
      setNewArtContent('');
      setNewArtAttachments([]);
      setAttachmentError(null);
      setShowLinkInput(false);
      setArticleStatus({
        type: 'success',
        message: 'Aviation Knowledge Article published to Firestore!',
      });
    } catch (err: any) {
      setArticleStatus({
        type: 'error',
        message: `Failed to publish article to Firestore: ${err?.message || 'Permission or network error'}`,
      });
    } finally {
      setPublishingArticle(false);
    }
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || !newProdDesc) return;
    onAddProduct({
      id: `prod-${Date.now()}`,
      title: newProdTitle,
      category: newProdCategory,
      description: newProdDesc,
      priceINR: newProdPrice,
      features: ['Automated Formula Engine', 'PDF/Excel Ready', 'Single License'],
      previewImage: DEFAULT_AVIATION_HERO_IMAGE,
      downloadFileName: `WingFuel_${newProdTitle.replace(/\s+/g, '_')}.xlsx`,
      fileSizeBytes: '3.2 MB',
      status: 'active'
    });
    setNewProdTitle('');
    setNewProdDesc('');
    alert('Digital Product Published to Store!');
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany) return;
    onAddJob({
      id: `job-${Date.now()}`,
      title: newJobTitle,
      company: newJobCompany,
      location: newJobLocation || 'India',
      type: 'Full-Time',
      category: 'Ground Operations',
      qualifications: 'Degree / Diploma in Aviation Engineering with relevant airport refuelling experience.',
      applyUrl: newJobApplyUrl || 'https://wingfuel.co/jobs/apply',
      expiryDate: '2026-12-31',
      status: 'published'
    });
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobLocation('');
    setNewJobApplyUrl('');
    alert('Aviation Career Listing Published!');
  };

  // If not logged in as Admin, show Secure Login Screen
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-orange-950 border border-orange-500/50 text-orange-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">WingFuel Administrator Panel</h2>
          <p className="text-xs text-slate-400">Authorized administrator access only for website content and database management.</p>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-orange-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> Protected Firestore Security Rules
          </div>
          <p>Sign in with your verified administrator Google account or your Firebase Admin ID &amp; password.</p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/70 rounded-xl text-xs text-rose-300">
            {authError}
          </div>
        )}

        {authInfo && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/70 rounded-xl text-xs text-emerald-300">
            {authInfo}
          </div>
        )}

        {/* Option 1: Google Sign-In */}
        <button
          type="button"
          onClick={handleAdminSignIn}
          disabled={authLoading}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Sign In with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center text-[10px] uppercase font-bold text-slate-500">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 shrink-0">or with Admin ID &amp; Password</span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Option 2: Admin Email ID & Password */}
        <form onSubmit={handleAdminPasswordSignIn} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Admin ID (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@wingfuel.co"
                autoComplete="username"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl pl-9 pr-3 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <button
                type="button"
                onClick={handleSendAdminPasswordReset}
                disabled={authLoading}
                className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold"
              >
                Set / Reset Password?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type={showAdminPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl pl-9 pr-10 py-2.5 text-white"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(prev => !prev)}
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-white"
                aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4 text-orange-400" />}
            Sign In with ID &amp; Password
          </button>
        </form>
      </div>
    );
  }

  // If signed in with a non-admin account (or unverified email), block access strictly
  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-rose-900/60 rounded-2xl shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white">
            {isUnverifiedAdminEmail ? 'Email Verification Required' : 'Access Denied'}
          </h2>
          <p className="text-xs text-slate-400">
            Signed in as <strong className="text-slate-200">{currentUser.email || 'Unknown account'}</strong>.
          </p>
          <p className="text-xs text-rose-300 pt-1">
            {isUnverifiedAdminEmail
              ? 'Please verify your email address before accessing administrator controls and Firestore writes.'
              : 'This account does not have administrator privileges for WingFuel.co.'}
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/70 rounded-xl text-xs text-rose-300 text-left">
            {authError}
          </div>
        )}

        {verificationSent && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/70 rounded-xl text-xs text-emerald-300 text-left">
            Verification email sent to {currentUser.email}. Click the link in your inbox, then tap "I've Verified — Refresh".
          </div>
        )}

        {isUnverifiedAdminEmail && (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleSendAdminVerification}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Send Verification Email
            </button>
            <button
              type="button"
              onClick={handleRefreshVerification}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              I&apos;ve Verified &mdash; Refresh
            </button>
          </div>
        )}

        <button
          onClick={() => signOut(auth)}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 text-rose-400" /> Sign Out &amp; Switch Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">WingFuel Control Center</h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Logged in as: <strong className="text-slate-200">{currentUser.email}</strong></p>
          </div>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Secure Admin Logout
        </button>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'stats', label: 'Dashboard Stats', icon: Activity },
          { id: 'news', label: `News & RSS Queue (${pendingNews.length})`, icon: Newspaper },
          { id: 'articles', label: `Articles (${articles.length})`, icon: FileText },
          { id: 'products', label: `Digital Products (${products.length})`, icon: ShoppingBag },
          { id: 'jobs', label: `Careers (${jobs.length})`, icon: Briefcase },
          { id: 'subscribers', label: 'Newsletter Subscribers', icon: Users },
          { id: 'settings', label: 'Site Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Stats & Overview */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Knowledge Articles</span>
              <div className="text-3xl font-black text-white font-mono">{articles.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Approved News Items</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">{approvedNews.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Pending RSS Queue</span>
              <div className="text-3xl font-black text-orange-400 font-mono">{pendingNews.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Digital Products</span>
              <div className="text-3xl font-black text-rose-400 font-mono">{products.length}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" /> Recent Administrator Activity Log
            </h3>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>[LOG-1092] Provisioned Firebase Firestore & Auth</span>
                <span className="text-slate-500">Just Now</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>[LOG-1091] Executed Gemini 3.6 Flash News Aggregation Workflow</span>
                <span className="text-slate-500">10 mins ago</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>[LOG-1090] Deployed ASTM D1250 Density Calculator Module</span>
                <span className="text-slate-500">30 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: News Management & RSS Review Queue */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-orange-400" /> RSS Ingestion & Semi-Automated Gemini Review Queue
              </h2>
              <p className="text-xs text-slate-400">Articles collected via RSS are summarized by Gemini AI and require your manual approval before publishing.</p>
            </div>
            <button
              onClick={handleFetchRssFeeds}
              disabled={rssFetching}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${rssFetching ? 'animate-spin' : ''}`} /> Fetch Configured RSS Feeds
            </button>
          </div>

          {rssMessage && (
            <div className="p-3 bg-purple-950/60 border border-purple-800 text-purple-200 text-xs rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> {rssMessage}
            </div>
          )}

          {/* Pending Queue Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending Approval Queue ({pendingNews.length})</h3>
            
            {pendingNews.length === 0 ? (
              <div className="p-8 bg-slate-900/50 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                No pending news items requiring review. Click "Fetch Configured RSS Feeds" above to collect new stories.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingNews.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400 font-bold bg-orange-950 px-2.5 py-0.5 rounded border border-orange-800">
                        {item.category}
                      </span>
                      <span className="text-slate-400 font-mono">Source: {item.sourceName}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.title}</h4>

                    {item.aiSummarized && (
                      <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-lg text-xs text-purple-200 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-purple-300">
                          <Sparkles className="w-3.5 h-3.5" /> Gemini AI Generated Summary:
                        </span>
                        <p>{item.summary}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => onRejectNews(item.id)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => onApproveNews(item.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve & Publish Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Article Management */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateArticleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" /> Publish New Aviation Knowledge Article
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
                <input
                  type="text"
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  placeholder="e.g., Hydrant Valve Maintenance Procedures"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newArtCategory}
                  onChange={(e) => setNewArtCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="Aviation Fuel">Aviation Fuel</option>
                  <option value="Airport Operations">Airport Operations</option>
                  <option value="Technical Knowledge">Technical Knowledge</option>
                  <option value="Safety & Compliance">Safety & Compliance</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Executive Summary</label>
              <textarea
                value={newArtSummary}
                onChange={(e) => setNewArtSummary(e.target.value)}
                rows={2}
                placeholder="Short summary for cards..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Full Markdown Content</label>
              <textarea
                value={newArtContent}
                onChange={(e) => setNewArtContent(e.target.value)}
                rows={5}
                placeholder="Write full article prose..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            {/* Attachments Section */}
            <div className="text-xs space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-orange-400" />
                  Attachments (Optional — PDF, Docs, Excel, Images, or External Link)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileAttachmentChange}
                    className="hidden"
                    id="article-attachment-input"
                  />
                  <label
                    htmlFor="article-attachment-input"
                    className="cursor-pointer px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-400" /> Upload File
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput(prev => !prev);
                      setAttachmentError(null);
                    }}
                    className={`px-3 py-1.5 font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 ${
                      showLinkInput
                        ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 text-orange-400" /> Add External Link
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Direct uploads support files up to 500 KB each (650 KB total per article). For larger manuals, circulars, or spreadsheets, attach a Google Drive / PDF URL via <strong className="text-slate-300">Add External Link</strong>.
              </p>

              {showLinkInput && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Attachment Label</label>
                    <input
                      type="text"
                      value={attachmentLinkName}
                      onChange={(e) => setAttachmentLinkName(e.target.value)}
                      placeholder="e.g., DGCA Circular 2026 PDF"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Document / File URL</label>
                    <input
                      type="url"
                      value={attachmentLinkUrl}
                      onChange={(e) => setAttachmentLinkUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or https://example.com/file.pdf"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddExternalAttachment}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              )}

              {attachmentError && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800/70 rounded-lg text-rose-300 text-xs">
                  {attachmentError}
                </div>
              )}

              {newArtAttachments.length > 0 && (
                <div className="space-y-2">
                  {newArtAttachments.map((att, index) => (
                    <div
                      key={`${att.name}-${index}`}
                      className="flex items-center justify-between gap-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {att.source === 'url' ? (
                          <ExternalLink className="w-4 h-4 text-orange-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-slate-200 font-semibold truncate">{att.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {att.source === 'url'
                              ? att.url
                              : `${att.type || 'File'}${att.size ? ` · ${formatFileSize(att.size)}` : ''}`}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {articleStatus && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium ${
                  articleStatus.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {articleStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={publishingArticle}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-2"
            >
              {publishingArticle && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {publishingArticle ? 'Publishing to Firestore...' : 'Publish Knowledge Article to Firestore'}
            </button>
          </form>

          {/* Existing Published Articles Overview */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Published Knowledge Articles ({articles.length})
            </h4>
            <div className="space-y-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{art.title}</div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-orange-400 font-semibold">{art.category}</span>
                      <span>&middot;</span>
                      <span>{art.publishedAt}</span>
                      {art.attachments && art.attachments.length > 0 && (
                        <>
                          <span>&middot;</span>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <Paperclip className="w-3 h-3" />
                            {art.attachments.length} {art.attachments.length === 1 ? 'Attachment' : 'Attachments'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 self-start sm:self-center shrink-0">
                    {art.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Digital Product Store Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateProductSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" /> Add Digital Product to Store
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  placeholder="e.g., Apron Fuel QC Checklist Excel"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="Operations Dashboards">Operations Dashboards</option>
                  <option value="Excel Templates">Excel Templates</option>
                  <option value="Aviation Checklists">Aviation Checklists</option>
                  <option value="Interview Preparation Kits">Interview Preparation Kits</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price in INR (₹)</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Description & Features</label>
              <textarea
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                rows={3}
                placeholder="Product overview..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Add Digital Product
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: Job Board Management */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateJobSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Post Aviation Career Opportunity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g., Fuel Farm Shift Engineer"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="e.g., Bharat Petroleum Aviation"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  placeholder="e.g., Delhi International Airport (DEL)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application URL</label>
                <input
                  type="url"
                  value={newJobApplyUrl}
                  onChange={(e) => setNewJobApplyUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Publish Job Listing
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400" /> Newsletter Subscribers
          </h3>
          <p className="text-xs text-slate-400">Subscribers who signed up via the WingFuel.co newsletter form.</p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            <span>demo.subscriber@aviation.org &middot; Subscribed 2026-11-06</span>
          </div>
        </div>
      )}

      {/* TAB 7: Site Settings & AdMob Configuration */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <AdminPasswordSettingsCard currentUser={currentUser} />

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" /> Google AdMob & AdSense Monetization Manager
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Configure your Google AdMob / AdSense Publisher ID, Ad Unit IDs, and mobile anchor placement for wingfuel.co.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold rounded-lg font-mono">
                MONETIZATION ACTIVE
              </span>
            </div>

            <AdMobSettingsForm />
          </div>

          {/* AdMob Setup Instructions Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs text-slate-300">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" /> Step-by-Step Google AdMob Account Setup Guide
            </h4>
            
            <ol className="space-y-3 list-decimal list-inside text-slate-300 leading-relaxed">
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <strong className="text-white">Create & Verify AdMob Account:</strong> Sign in to <a href="https://admob.google.com" target="_blank" rel="noreferrer" className="text-orange-400 underline font-semibold">admob.google.com</a> using your Google account and complete identity and payment verification.
              </li>
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <strong className="text-white">Add App / Domain (wingfuel.co):</strong> Click <em>Apps &rarr; Add App</em>. Select Web/Android platform and register <strong>wingfuel.co</strong> as your official site domain.
              </li>
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <strong className="text-white">Create Ad Units:</strong> Under <em>Ad Units</em>, generate 4 ad units:
                <ul className="list-disc list-inside mt-1 ml-4 space-y-1 font-mono text-[11px] text-slate-400">
                  <li>Leaderboard Banner (728x90) for Homepage & News headers</li>
                  <li>Medium Rectangle (300x250) for Article sidebars</li>
                  <li>Inline Native Banner for article prose sections</li>
                  <li>Mobile Sticky Anchor Banner (320x50) for bottom mobile viewports</li>
                </ul>
              </li>
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <strong className="text-white">Associate Keys in Admin Panel:</strong> Copy your Publisher ID (<code className="text-orange-400">ca-pub-XXXXXXXXXXXXXXXX</code>) and Ad Unit IDs into the form above, turn off Test Mode, and click <em>Save AdMob Configuration</em>.
              </li>
            </ol>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for linking or updating Admin Email/Password login
const AdminPasswordSettingsCard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const hasPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');

  const handleSetAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!currentUser.email) {
      setStatus({ type: 'error', message: 'No email address associated with this admin account.' });
      return;
    }
    if (newPass.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }
    if (newPass !== confirmPass) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSaving(true);
    try {
      if (hasPasswordProvider) {
        await updatePassword(currentUser, newPass);
        setStatus({ type: 'success', message: `Admin password updated for ${currentUser.email}.` });
      } else {
        const credential = EmailAuthProvider.credential(currentUser.email, newPass);
        await linkWithCredential(currentUser, credential);
        setStatus({
          type: 'success',
          message: `Password login enabled for ${currentUser.email}! You can now sign in with either Google or Email + Password.`,
        });
      }
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setStatus({
          type: 'error',
          message: 'Enable the Email/Password sign-in provider in Firebase Console (Authentication → Sign-in method → Email/Password) first.',
        });
      } else if (code === 'auth/requires-recent-login') {
        setStatus({
          type: 'error',
          message: 'For security, please log out and sign back in with Google before setting or changing your password.',
        });
      } else if (code === 'auth/provider-already-linked') {
        try {
          await updatePassword(currentUser, newPass);
          setStatus({ type: 'success', message: `Admin password updated for ${currentUser.email}.` });
          setNewPass('');
          setConfirmPass('');
        } catch (updateErr: any) {
          setStatus({ type: 'error', message: updateErr?.message || 'Could not update password.' });
        }
      } else {
        setStatus({ type: 'error', message: err?.message || 'Failed to save admin password.' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-orange-400" /> Admin ID &amp; Password Login
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Set or update a Firebase password for <strong className="text-slate-200">{currentUser.email}</strong> to sign in without Google.
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-lg font-mono font-bold border ${
            hasPasswordProvider
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-slate-950 text-slate-400 border-slate-700'
          }`}
        >
          {hasPasswordProvider ? 'PASSWORD LINKED' : 'GOOGLE ONLY'}
        </span>
      </div>

      <form onSubmit={handleSetAdminPassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            {hasPasswordProvider ? 'New Admin Password' : 'Create Admin Password'}
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Minimum 8 characters"
            minLength={8}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Re-enter password"
            minLength={8}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl shadow transition-colors inline-flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          {hasPasswordProvider ? 'Update Password' : 'Enable Password Login'}
        </button>
      </form>

      {status && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium ${
            status.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};

// Sub-component for AdMob Settings Form
const AdMobSettingsForm: React.FC = () => {
  const [publisherId, setPublisherId] = useState('ca-pub-2011257851590169');
  const [enabled, setEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [leaderboardUnit, setLeaderboardUnit] = useState('ca-pub-2011257851590169/leaderboard');
  const [sidebarUnit, setSidebarUnit] = useState('ca-pub-2011257851590169/sidebar');
  const [inlineUnit, setInlineUnit] = useState('ca-pub-2011257851590169/inline');
  const [mobileUnit, setMobileUnit] = useState('ca-pub-2011257851590169/mobile-anchor');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      publisherId: publisherId.trim(),
      enabled,
      testMode,
      adUnits: {
        leaderboard: leaderboardUnit.trim(),
        sidebar: sidebarUnit.trim(),
        inlineArticle: inlineUnit.trim(),
        mobileSticky: mobileUnit.trim()
      }
    };
    try {
      localStorage.setItem('wingfuel_admob_config', JSON.stringify(config));
      window.dispatchEvent(new Event('storage'));
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.warn('Save failed:', err);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">AdMob / AdSense Publisher ID</label>
          <input
            type="text"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
            required
          />
        </div>

        <div className="flex items-center gap-6 pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500"
            />
            <span className="font-semibold text-white">Enable Ad Banners</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500"
            />
            <span className="font-semibold text-amber-400">AdMob Test Mode</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Leaderboard Banner Ad Unit ID</label>
          <input
            type="text"
            value={leaderboardUnit}
            onChange={(e) => setLeaderboardUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Sidebar Rectangle Ad Unit ID</label>
          <input
            type="text"
            value={sidebarUnit}
            onChange={(e) => setSidebarUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Inline Native Article Ad Unit ID</label>
          <input
            type="text"
            value={inlineUnit}
            onChange={(e) => setInlineUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Mobile Sticky Anchor Banner Ad Unit ID</label>
          <input
            type="text"
            value={mobileUnit}
            onChange={(e) => setMobileUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-[11px]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
      >
        Save AdMob Configuration
      </button>

      {savedMsg && (
        <span className="ml-3 text-xs text-emerald-400 font-semibold">
          &check; AdMob configuration saved successfully!
        </span>
      )}
    </form>
  );
};

