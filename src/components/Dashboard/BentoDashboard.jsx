import React, { useMemo } from 'react';
import { useReportContext } from '../../context/ReportContext';
import { Activity, CheckCircle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const GhostLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-panel bg-white/5 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between animate-pulse">
        <div className="space-y-3 w-1/2">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-8 bg-white/10 rounded w-2/3"></div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10"></div>
      </div>
    ))}
  </div>
);

const BentoDashboard = () => {
  const { issues, loadingDb } = useReportContext();

  const stats = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    // Calculate total upvotes across all issues
    const totalUpvotes = issues.reduce((acc, curr) => acc + (curr.upvotes ? curr.upvotes.length : 0), 0);
    return { total, resolved, totalUpvotes };
  }, [issues]);

  if (loadingDb) return <GhostLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel bg-white/5 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between"
      >
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Reports</p>
          <h3 className="text-4xl font-bold text-white">{stats.total}</h3>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
          <Activity className="text-primary animate-pulse" size={28} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel bg-white/5 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between"
      >
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Resolved Issues</p>
          <h3 className="text-4xl font-bold text-white">{stats.resolved}</h3>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle className="text-emerald-400" size={28} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-panel bg-white/5 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium mb-1">Community Heat</p>
          <h3 className="text-4xl font-bold text-white">{stats.totalUpvotes}</h3>
        </div>
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Flame className="text-indigo-400" size={28} />
        </div>
      </motion.div>
    </div>
  );
};

export default BentoDashboard;
