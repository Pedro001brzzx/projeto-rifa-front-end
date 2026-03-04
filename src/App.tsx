/**
 * Componente Principal - Gêmeos Brasil
 * Refatorado usando padrão MVC + AuthContext + Routing
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './route';

import InstallAppButton from './components/InstallAppButton';
import WhatsAppFloat from './components/WhatsAppFloat';

// Styles
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
      <InstallAppButton />
      <WhatsAppFloat />
    </AuthProvider>
  );
};

export default App;