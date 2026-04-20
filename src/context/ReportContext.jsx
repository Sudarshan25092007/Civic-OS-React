import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useFirestore } from '../hooks/useFirestore';

const ReportContext = createContext();

export const useReportContext = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = 'civicreporterapp@gmail.com';

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
      setLoadingAuth(false);
    });

    return () => unsubAuth();
  }, []);

  const { issues, loadingDb, addIssue, updateIssueData, updateStatus, toggleUpvote, removeIssue } = useFirestore(user, isAdmin, loadingAuth);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const submitIssue = async (issueData) => {
    if (!user) throw new Error("Must be logged in to report.");
    await addIssue(issueData, user.uid);
  };

  const updateIssue = async (id, issueData) => {
    if (!user) throw new Error("Must be logged in.");
    await updateIssueData(id, issueData);
  };

  const handleUpdateStatus = async (id, status) => {
    if (!isAdmin) throw new Error("Unauthorized");
    await updateStatus(id, status);
  };

  const handleToggleUpvote = async (id, currentUpvotes) => {
    if (!user) return;
    await toggleUpvote(id, currentUpvotes, user.uid);
  };

  const deleteIssue = async (id) => {
    await removeIssue(id);
  };

  const loading = loadingDb || loadingAuth;

  return (
    <ReportContext.Provider value={{
      issues,
      user,
      isAdmin,
      loading,
      loadingDb,
      login,
      signup,
      logout,
      submitIssue,
      updateStatus: handleUpdateStatus,
      updateIssue,
      toggleUpvote: handleToggleUpvote,
      deleteIssue
    }}>
      {children}
    </ReportContext.Provider>
  );
};
