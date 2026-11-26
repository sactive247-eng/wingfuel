import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { doc, increment, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const VISIT_SESSION_KEY = 'wingfuel_visit_counted';
const VISITOR_DOC_PATH = 'siteStats/visitors';

export const VisitorCounter: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const visitorRef = doc(db, 'siteStats', 'visitors');

    // Subscribe to real-time updates for total visitor count
    const unsubscribe = onSnapshot(
      visitorRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.count === 'number') {
            setVisitCount(data.count);
          }
        } else {
          setVisitCount(0);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, VISITOR_DOC_PATH);
        } catch {
          // Error already logged by handleFirestoreError; keep footer UI intact
        }
      }
    );

    // Increment once per browser tab session
    const recordVisit = async () => {
      try {
        if (sessionStorage.getItem(VISIT_SESSION_KEY)) {
          return;
        }
        sessionStorage.setItem(VISIT_SESSION_KEY, '1');
        await setDoc(
          visitorRef,
          {
            count: increment(1),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        sessionStorage.removeItem(VISIT_SESSION_KEY);
        try {
          handleFirestoreError(error, OperationType.WRITE, VISITOR_DOC_PATH);
        } catch {
          // Error already logged by handleFirestoreError; keep footer UI intact
        }
      }
    };

    recordVisit();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs"
      title="Total site visits"
    >
      <Eye className="w-3.5 h-3.5 text-orange-500 shrink-0" />
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
        Visitors:
      </span>
      <span className="text-[11px] font-bold font-mono tabular-nums text-slate-900 dark:text-white">
        {visitCount !== null ? visitCount.toLocaleString() : '—'}
      </span>
    </div>
  );
};
