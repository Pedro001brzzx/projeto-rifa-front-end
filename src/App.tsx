/**
 * Componente Principal - Gêmeos Brasil
 * Refatorado usando padrão MVC + AuthContext + Routing
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './route';

// Styles
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;