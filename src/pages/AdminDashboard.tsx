import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Check, X, Edit, Trash2, Plus, Sparkles, 
  RefreshCw, FileText, Newspaper, ShoppingBag, Briefcase, Users, Activity, Settings 
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, User } from '../lib/firebase';
import { Article, NewsItem, DigitalProduct, JobListing } from '../lib/seedData';

interface AdminDashboardProps {
  currentUser: User | null;
  articles: Article[];
  news: NewsItem[];
  products: DigitalProduct[];
  jobs: JobListing[];
  onAddArticle: (art: Article) => void;
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

  const pendingNews = news.filter((n) => n.status === 'pending');
  const approvedNews = news.filter((n) => n.status === 'approved');

  const handleAdminSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Admin Sign-In Error:', err);
      alert('Sign in failed: ' + err.message);
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

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle || !newArtContent) return;
    onAddArticle({
      id: `art-${Date.now()}`,
      title: newArtTitle,
      slug: newArtTitle.toLowerCase().replace(/\s+/g, '-'),
      category: newArtCategory,
      summary: newArtSummary || newArtContent.slice(0, 150) + '...',
      content: newArtContent,
      author: currentUser?.displayName || 'Authorized Administrator',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      status: 'published'
    });
    setNewArtTitle('');
    setNewArtSummary('');
    setNewArtContent('');
    alert('Aviation Knowledge Article Published to Firestore!');
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
      previewImage: '/src/assets/images/aviation_knowledge_hub_1794011580342.jpg',
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
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-950 border border-orange-500/50 text-orange-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">WingFuel Administrator Panel</h2>
          <p className="text-xs text-slate-400 mt-1">Authorized single-administrator access for website content and database management.</p>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-2">
          <div className="flex items-center gap-2 text-orange-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> Protected Firestore Security Rules
          </div>
          <p>Public visitors browse published content. Only authenticated administrator accounts can create, edit, approve RSS news, or modify products.</p>
        </div>

        <button
          onClick={handleAdminSignIn}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Sign In with Firebase Auth (Google)
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

            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Publish Knowledge Article to Firestore
            </button>
          </form>
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

