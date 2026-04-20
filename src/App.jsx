import React, { useState, useMemo } from 'react';
import { useReportContext } from './context/ReportContext';
import BentoDashboard from './components/Dashboard/BentoDashboard';
import IncidentMap from './components/Map/IncidentMap';
import FeedSidebar from './components/Feed/FeedSidebar';
import ReportingModal from './components/Modals/ReportingModal';
import IssueDetailsModal from './components/Modals/IssueDetailsModal';
import AdminPanel from './components/Admin/AdminPanel';
import { LogOut, Plus, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { issues, user, isAdmin, loading, login, signup, logout } = useReportContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState('Global'); // 'Global' | 'Personal'

  const filteredIssues = useMemo(() => {
    if (viewMode === 'Personal' && user) {
      return issues.filter(issue => issue.userId === user.uid);
    }
    return issues;
  }, [issues, viewMode, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLogin) await login(email, password);
      else await signup(email, password);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleNewReport = () => {
    setEditMode(false);
    setEditData(null);
    setIsReportModalOpen(true);
  };

  const handleEditReport = () => {
    setEditMode(true);
    setEditData(selectedIssue);
    setSelectedIssue(null);
    setIsReportModalOpen(true);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="glass-panel max-w-md w-full p-8 rounded-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CIVIC OS</h1>
            <p className="text-gray-400 mt-2">Civic OS Authorization</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {authError && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">{authError}</div>}
            <input 
              type="email" 
              placeholder="System Email" 
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full bg-surface border border-cardBorder p-4 rounded-xl focus:border-primary outline-none transition"
              required
            />
            <input 
              type="password" 
              placeholder="Access Token (Password)" 
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full bg-surface border border-cardBorder p-4 rounded-xl focus:border-primary outline-none transition"
              required
            />
            <button type="submit" className="w-full bg-primary text-[#0F172A] font-bold p-4 rounded-xl hover:bg-emerald-400 transition hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {isLogin ? 'Initialize Session' : 'Register Identity'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? 'New citizen? ' : 'Has clearance? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? 'Request Access' : 'Login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <Toaster position="top-center" />
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
            CIIC REPLICA
          </h1>
          <p className="text-gray-400 text-sm ml-6">v3.0.0 - Transparency Mode</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-surface/80 p-1 rounded-xl border border-white/5 shadow-lg">
            <button 
              onClick={() => setViewMode('Global')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'Global' ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Global Feed
            </button>
            <button 
              onClick={() => setViewMode('Personal')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'Personal' ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-gray-400 hover:text-white'}`}
            >
              My Reports
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="hidden md:flex items-center gap-1.5 text-accent text-sm font-semibold bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                <Shield size={16} /> Root
              </span>
            )}
            <button onClick={handleNewReport} className="flex items-center gap-2 bg-primary text-[#0F172A] font-bold px-4 md:px-5 py-2.5 rounded-xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Plus size={18} /> <span className="hidden md:inline">New Report</span>
            </button>
            <button onClick={logout} className="p-2.5 rounded-xl bg-surface border border-cardBorder text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <BentoDashboard />
        
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <IncidentMap issues={filteredIssues} />
          <FeedSidebar issues={filteredIssues} onIssueClick={handleIssueClick} />
        </div>

        {isAdmin && (
          <div className="mt-8">
            <AdminPanel />
          </div>
        )}
      </main>

      <ReportingModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        editMode={editMode}
        initialData={editData}
      />

      <IssueDetailsModal 
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onEdit={handleEditReport}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
