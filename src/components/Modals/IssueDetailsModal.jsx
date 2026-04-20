import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, MapPin, Clock, ThumbsUp } from 'lucide-react';
import { useReportContext } from '../../context/ReportContext';

const IssueDetailsModal = ({ issue, onClose, onEdit }) => {
  const { user, deleteIssue, isAdmin, toggleUpvote } = useReportContext();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!issue) return null;

  const isOwner = user?.uid === issue.userId;
  const canEditOrDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setIsDeleting(true);
      try {
        await deleteIssue(issue.id);
        onClose();
      } catch (err) {
        alert("Failed to delete: " + err.message);
        setIsDeleting(false);
      }
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 z-10 transition-colors backdrop-blur">
          <X size={20} />
        </button>

        {issue.imageUrl && (
          <div className="w-full h-64 sm:h-80 relative shrink-0">
            <img 
              src={issue.imageUrl} 
              alt="Issue evidence" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-6 flex items-center gap-3">
               <span className={`px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md border ${
                  issue.status === 'Resolved' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {issue.status}
                </span>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-black/50 text-white backdrop-blur-md border border-white/10">
                  {issue.type}
                </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Report Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-gray-300 bg-surface/50 p-4 rounded-xl border border-cardBorder">
              <MapPin className="text-primary shrink-0" size={20} />
              <span className="text-sm font-medium line-clamp-2">{issue.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-surface/50 p-4 rounded-xl border border-cardBorder">
              <Clock className="text-accent shrink-0" size={20} />
              <span className="text-sm font-medium">Reported {timeAgo(issue.createdAt || issue.timestamp)}</span>
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center bg-surface/30 p-4 rounded-xl border border-cardBorder/50">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Community Support</span>
            <button 
              onClick={() => toggleUpvote(issue.id, issue.upvotes)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                issue.upvotes?.includes(user?.uid) 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-surface border border-cardBorder text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ThumbsUp size={18} className={issue.upvotes?.includes(user?.uid) ? 'fill-current' : ''} />
              <span className="font-bold text-lg">{issue.upvotes?.length || 0} Upvotes</span>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-200 leading-relaxed bg-surface/30 p-4 rounded-xl border border-cardBorder/50">
              {issue.description}
            </p>
          </div>

          {canEditOrDelete && (
            <div className="flex gap-4 pt-6 border-t border-cardBorder">
              <button 
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-surface border border-cardBorder text-white font-bold p-3.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Edit2 size={18} /> Edit Report
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold p-3.5 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} /> {isDeleting ? 'Deleting...' : 'Delete Report'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default IssueDetailsModal;
