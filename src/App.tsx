import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { GeminiImageGenModal } from './components/GeminiImageGenModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { UserAuthModal } from './components/UserAuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { OperationsPage } from './pages/OperationsPage';
import { JobsPage } from './pages/JobsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ToolsPage } from './pages/ToolsPage';
import { InsightsPage } from './pages/InsightsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Firebase & Initial Seed Data
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db, onAuthStateChanged, User, testFirestoreConnection, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  INITIAL_ARTICLES, INITIAL_NEWS, INITIAL_PRODUCTS, INITIAL_JOBS,
  Article, NewsItem, DigitalProduct, JobListing 
} from './lib/seedData';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [userAuthModalOpen, setUserAuthModalOpen] = useState(false);
  const [userAuthMode, setUserAuthMode] = useState<'signin' | 'signup'>('signup');

  // Application Data State
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [products, setProducts] = useState<DigitalProduct[]>(INITIAL_PRODUCTS);
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);

  // Theme state: dark mode default, persisted in localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('wingfuel_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wingfuel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wingfuel_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Subscribe to published Knowledge Articles in Firestore and merge with seed articles
    const articlesQuery = query(
      collection(db, 'articles'),
      where('status', '==', 'published')
    );
    const unsubscribeArticles = onSnapshot(
      articlesQuery,
      (snapshot) => {
        const firestoreArticles: Article[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Partial<Article>;
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Article',
            slug: data.slug || docSnap.id,
            category: data.category || 'Aviation Fuel',
            subCategory: data.subCategory,
            summary: data.summary || '',
            content: data.content || '',
            author: data.author || 'WingFuel Editorial',
            publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
            readTime: data.readTime || '5 min read',
            status: 'published',
            coverImage: data.coverImage,
            attachments: Array.isArray(data.attachments) ? data.attachments : undefined,
          };
        });

        firestoreArticles.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

        const seenIds = new Set(firestoreArticles.map((a) => a.id));
        const merged = [
          ...firestoreArticles,
          ...INITIAL_ARTICLES.filter((seed) => !seenIds.has(seed.id)),
        ];
        setArticles(merged);
      },
      (error) => {
        console.warn('Firestore articles listener fallback to local seed data:', error.message);
      }
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribeAuth();
      unsubscribeArticles();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUserAuth = (mode: 'signin' | 'signup' = 'signup') => {
    setUserAuthMode(mode);
    setUserAuthModalOpen(true);
  };

  // Handlers for Admin mutations
  const handleAddArticle = async (art: Article) => {
    const payload: Record<string, unknown> = {
      id: art.id,
      title: art.title,
      slug: art.slug,
      category: art.category,
      summary: art.summary,
      content: art.content,
      author: art.author,
      publishedAt: art.publishedAt,
      readTime: art.readTime,
      status: art.status,
    };
    if (art.subCategory) payload.subCategory = art.subCategory;
    if (art.coverImage) payload.coverImage = art.coverImage;
    if (art.attachments && art.attachments.length > 0) {
      payload.attachments = art.attachments;
    }

    try {
      await setDoc(doc(db, 'articles', art.id), payload);
      setArticles(prev => [art, ...prev.filter(item => item.id !== art.id)]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `articles/${art.id}`);
    }
  };

  const handleApproveNews = (newsId: string) => {
    setNews(prev => prev.map(item => item.id === newsId ? { ...item, status: 'approved' as const } : item));
  };

  const handleRejectNews = (newsId: string) => {
    setNews(prev => prev.map(item => item.id === newsId ? { ...item, status: 'rejected' as const } : item));
  };

  const handleAddProduct = (prod: DigitalProduct) => {
    setProducts(prev => [prod, ...prev]);
  };

  const handleAddJob = (job: JobListing) => {
    setJobs(prev => [job, ...prev]);
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200">
      
      {/* Top Bar Navigation Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
        onOpenAiImageModal={() => setAiModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        onOpenUserAuth={handleOpenUserAuth}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            articles={articles}
            news={news}
            products={products}
          />
        )}

        {currentView === 'news' && (
          <NewsPage news={news} />
        )}

        {currentView === 'knowledge' && (
          <KnowledgePage articles={articles} />
        )}

        {currentView === 'operations' && (
          <OperationsPage />
        )}

        {currentView === 'jobs' && (
          <JobsPage jobs={jobs} />
        )}

        {currentView === 'products' && (
          <ProductsPage products={products} />
        )}

        {currentView === 'tools' && (
          <ToolsPage />
        )}

        {currentView === 'insights' && (
          <InsightsPage />
        )}

        {currentView === 'about' && (
          <AboutPage />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            articles={articles}
            news={news}
            products={products}
            jobs={jobs}
            onAddArticle={handleAddArticle}
            onApproveNews={handleApproveNews}
            onRejectNews={handleRejectNews}
            onAddProduct={handleAddProduct}
            onAddJob={handleAddJob}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky AdMob Anchor Banner (per user request & skill guidelines) */}
      <AdBanner type="mobile-sticky" />

      {/* Global Search Command Overlay */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        articles={articles}
        news={news}
        products={products}
        onNavigate={handleNavigate}
      />

      {/* Category Notification Preferences & Alert Simulator Modal */}
      <NotificationSettingsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        userEmail={currentUser?.email}
      />

      {/* User Auth (Sign Up / Sign In) Modal */}
      <UserAuthModal
        isOpen={userAuthModalOpen}
        onClose={() => setUserAuthModalOpen(false)}
        initialMode={userAuthMode}
      />

      {/* Gemini 3 Pro AI Image Generator Modal */}
      <GeminiImageGenModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
