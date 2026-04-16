import React, { createContext, useState, useContext } from 'react';

const AdminSidebarContext = createContext();

export function AdminSidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AdminSidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  }
  return context;
}
