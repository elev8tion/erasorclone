"use client";
import { ReactNode, useEffect } from "react";
import { initializeLocalDB } from "@/lib/localdb";

export default function LocalDBProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    initializeLocalDB();
  }, []);

  return <>{children}</>;
}
