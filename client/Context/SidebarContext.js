import { createContext, useContext } from "react";

export const SidebarContext = createContext(null);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used inside SidebarContext.Provider");
  }
  return ctx;
};
