"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expand: () => void;
  collapse: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
  expand: () => {},
  collapse: () => {},
});

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const expand = () => setIsCollapsed(false);
  const collapse = () => setIsCollapsed(true);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleCollapse, expand, collapse }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  return context;
}
