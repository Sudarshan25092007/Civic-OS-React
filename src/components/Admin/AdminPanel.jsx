import React from 'react';
import { useReportContext } from '../../context/ReportContext';
import { XCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const { issues, updateStatus } = useReportContext();

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
        Admin Control Center
      </h2>
      
      <div className="space-y-4">
        {issues.map((issue) => {
          const isResolved = issue.status === 'Resolved';
          return (
            <motion.div 
              layout
              key={issue.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                isResolved 
                  ? 'bg-emerald-900/10 border-emerald-500/20' 
                  : 'bg-surface border-cardBorder hover:border-accent/30'
              }`}
            >
              <div>
                <h4 className="font-semibold text-white">{issue.type}</h4>
                <p className="text-xs text-gray-400 mt-1">{issue.location}</p>
              </div>
              <div>
                {isResolved ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                    <CheckCircle2 size={16} /> Resolved
                  </div>
                ) : (
                  <button 
                    onClick={() => updateStatus(issue.id, 'Resolved')}
                    className="flex items-center gap-2 text-amber-400 text-sm font-medium bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 hover:bg-amber-400 hover:text-[#0F172A] transition-all"
                  >
                    <XCircle size={16} /> Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
        {issues.length === 0 && (
          <p className="text-gray-500 text-center py-4">No issues populated in the global state.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
