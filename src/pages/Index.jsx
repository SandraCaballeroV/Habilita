import { useDarkMode } from 'context/darkMode';
import React from 'react';

const Index = () => {
  
  const { darkMode } = useDarkMode();
  return (
    <div className={`flex h-full bg-gray-${darkMode ? '900' : '50'}`}>
      Creación de Sistema de Gestión de Ventas - Habilitación
    </div>
  );
};

export default Index;