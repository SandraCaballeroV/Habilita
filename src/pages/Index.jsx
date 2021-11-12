import { useDarkMode } from 'context/darkMode';
import React from 'react';

const Index = () => {
  
  const { darkMode } = useDarkMode();
  return (
    <div className={`flex h-full bg-gray-${darkMode ? '900' : '50'}`}>
      <h2 className='text-3xl font-extrabold text-gray-900  justify-items-center'>
      Creación de Sistema de Gestión de Ventas - Habilitación Sandra Caballero V
          </h2>
    
    </div>
  );
};

export default Index;