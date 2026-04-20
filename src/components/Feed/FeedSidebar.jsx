import React from 'react';
import { useReportContext } from '../../context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const date = dateStr?.toDate ? dateStr.toDate() : new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const EmptyStateSVG = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500/50 mx-auto mb-4">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <path d="M13 8h4"></path>
    <path d="M13 12h4"></path>
  </svg>
);

const GhostFeedLoader = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white/5 backdrop-blur-md border border-cardBorder p-4 rounded-xl flex gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-lg bg-white/10 shrink-0"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-3 bg-white/10 rounded w-full"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const FeedSidebar = ({ issues: propIssues, onIssueClick }) => {
  const { issues: contextIssues, loadingDb, toggleUpvote, user } = useReportContext();
  const issues = propIssues || contextIssues;

  return (
    <div className="glass-panel bg-white/5 backdrop-blur-lg rounded-2xl p-6 h-[600px] overflow-y-auto w-full lg:w-1/3 flex flex-col gap-4 custom-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-2">Live Feed</h2>
      
      {loadingDb ? (
        <GhostFeedLoader />
      ) : issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full opacity-70">
          <EmptyStateSVG />
          <p className="text-gray-400 font-medium">No reports found.</p>
        </div>
      ) : (
        <AnimatePresence>
          {issues.map((issue, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.8, height: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              key={issue.id} 
              onClick={() => onIssueClick && onIssueClick(issue)}
              className="bg-white/5 backdrop-blur-md border border-cardBorder p-4 rounded-xl hover:border-primary/50 transition-colors duration-300 cursor-pointer flex gap-4 relative overflow-hidden group"
            >
              {/* Community Heat Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full z-0">
                <div 
                  className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500" 
                  style={{ width: `${Math.min((issue.upvotes?.length || 0) * 10, 100)}%` }}
                ></div>
              </div>

              {issue.imageUrl && (
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-cardBorder relative z-10">
                  <img src={issue.imageUrl} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="flex-1 min-w-0 py-1 relative z-10">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-white/90 truncate mr-2">{issue.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    issue.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1 mb-2">{issue.description}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span className="truncate w-1/2">{issue.location}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="shrink-0">{timeAgo(issue.createdAt || issue.timestamp)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUpvote(issue.id, issue.upvotes);
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
                        issue.upvotes?.includes(user?.uid) 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-surface border border-cardBorder text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <ThumbsUp size={12} className={issue.upvotes?.includes(user?.uid) ? 'fill-current' : ''} />
                      <span className="font-bold">{issue.upvotes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default FeedSidebar;
