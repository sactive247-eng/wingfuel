import React, { useState } from 'react';
import { Briefcase, MapPin, Building, Calendar, ExternalLink, Search } from 'lucide-react';
import { JobListing } from '../lib/seedData';
import { AdBanner } from '../components/AdBanner';

interface JobsPageProps {
  jobs: JobListing[];
}

export const JobsPage: React.FC<JobsPageProps> = ({ jobs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);

  const categories = [
    'All',
    'Ground Operations',
    'Fuel Logistics',
    'Quality Control',
    'Airport Engineering',
    'Safety Compliance'
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesCat = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
          <Briefcase className="w-4 h-4" /> Aviation Careers Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Airport Operations & Fuel Career Opportunities</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Verified job postings for refuelling supervisors, fuel farm engineers, airport QA specialists, and ground crew leadership.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, company, city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner type="leaderboard" />

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-400 font-bold bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800/60">
                  {job.category}
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                  {job.type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{job.title}</h3>

              <div className="space-y-1 text-xs text-slate-300">
                <p className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> {job.company}
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                </p>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {job.qualifications}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Expires: {job.expiryDate}
              </span>
              <button
                onClick={() => setActiveJobModal(job)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                Apply Now <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveJobModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              &times;
            </button>

            <span className="text-xs text-purple-400 font-bold bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
              {activeJobModal.category}
            </span>

            <h2 className="text-xl font-bold text-white">{activeJobModal.title}</h2>
            <p className="text-xs text-slate-400">{activeJobModal.company} &middot; {activeJobModal.location}</p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Required Experience & Qualifications</h4>
              <p className="leading-relaxed">{activeJobModal.qualifications}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Application Deadline: {activeJobModal.expiryDate}</span>
              <a
                href={activeJobModal.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg"
              >
                Proceed to Application Portal <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
