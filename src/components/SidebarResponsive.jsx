import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const SidebarResponsive = () => {
  const [mostrarNavegacion, setMostrarNavegacion] = useState(false);
  return (
    <div
      className='lg:hidden'
      onClick={() => {
        setMostrarNavegacion(!mostrarNavegacion);
      }}
    >
      <i
        className={`mx-2 fas fa-${
          mostrarNavegacion ? 'times' : 'bars'
        } hover:text-yellow-600 cursor-pointer`}
      />
      {mostrarNavegacion && (
        <ul className='bg-blue-900-900'>
          <ResponsiveRoute nombre='Vehículos' ruta='/admin/vehiculos' />
          <ResponsiveRoute nombre='Ventas' ruta='/admin/ventas' />
          <ResponsiveRoute nombre='Usuarios' ruta='/admin/usuarios' />
        </ul>
      )}
    </div>
  );
};
const ResponsiveRoute = ({ ruta, nombre }) => {
  return (
    <Link to={ruta}>
      <li className='text-black-200 border border-gray-300 p-1'>{nombre}</li>
    </Link>
  );
};
export default SidebarResponsive;
