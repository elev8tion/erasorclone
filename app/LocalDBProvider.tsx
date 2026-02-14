"use client";
import { ReactNode, useEffect } from "react";
import { initializeLocalDB } from "@/lib/localdb";
import pawnsData from "@/lib/pawns-plus-data.json";

export default function LocalDBProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Initialize local database on mount
    initializeLocalDB();

    // Load Pawns Plus visualizations
    const existingFiles = JSON.parse(localStorage.getItem('erasor_files') || '[]');
    const hasVisualizationFiles = existingFiles.some((f: any) =>
      f.fileName?.includes('Database Schema ERD') ||
      f.fileName?.includes('API Architecture')
    );

    if (!hasVisualizationFiles) {
      localStorage.setItem('erasor_users', JSON.stringify(pawnsData.users));
      localStorage.setItem('erasor_teams', JSON.stringify(pawnsData.teams));
      localStorage.setItem('erasor_files', JSON.stringify([...existingFiles, ...pawnsData.files]));

      if (!localStorage.getItem('erasor_current_user')) {
        localStorage.setItem('erasor_current_user', JSON.stringify(pawnsData.currentUser));
      }
      if (!localStorage.getItem('erasor_current_team')) {
        localStorage.setItem('erasor_current_team', JSON.stringify(pawnsData.currentTeam));
      }

      window.location.reload();
    }
  }, []);

  return <>{children}</>;
}
