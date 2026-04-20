import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useFirestore = (user, isAdmin, loadingAuth) => {
  const [issues, setIssues] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    if (loadingAuth) return;
    
    if (!user) {
      setIssues([]);
      setLoadingDb(false);
      return;
    }

    // Phase 3: Everyone listens to the global feed to see community heat
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData);
      setLoadingDb(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoadingDb(false);
    });

    return () => unsubscribe();
  }, [user, loadingAuth]);

  const addIssue = async (issueData, userUid) => {
    return await addDoc(collection(db, "issues"), {
      ...issueData,
      userId: userUid,
      status: "Pending",
      upvotes: [],
      createdAt: serverTimestamp()
    });
  };

  const updateIssueData = async (id, issueData) => {
    await updateDoc(doc(db, "issues", id), {
      ...issueData,
      updatedAt: serverTimestamp()
    });
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "issues", id), { status, updatedAt: serverTimestamp() });
  };

  const toggleUpvote = async (id, currentUpvotes, userUid) => {
    const isUpvoted = currentUpvotes && currentUpvotes.includes(userUid);
    const docRef = doc(db, "issues", id);
    await updateDoc(docRef, {
      upvotes: isUpvoted ? arrayRemove(userUid) : arrayUnion(userUid)
    });
  };

  const removeIssue = async (id) => {
    await deleteDoc(doc(db, "issues", id));
  };

  return {
    issues,
    loadingDb,
    addIssue,
    updateIssueData,
    updateStatus,
    toggleUpvote,
    removeIssue
  };
};
