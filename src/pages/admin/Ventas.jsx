import { nanoid } from 'nanoid';
import React, { useState, useEffect, useRef } from 'react';
import { crearVenta } from 'utils/api';
import { obtenerVehiculos } from 'utils/api';
import { obtenerUsuarios } from 'utils/api';


const Ventas = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [textoBoton, setTextoBoton] = useState('Crear Venta');
  const [colorBoton, setColorBoton] = useState('indigo');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  const form = useRef(null);
  const [vendedores, setVendedores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosTabla, setVehiculosTabla] = useState([]);
  
  useEffect(() => {
    const fetchVendores = async () => {
      await obtenerUsuarios(
        (response) => {
          setVendedores(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    const fetchVehiculos = async () => {
      await obtenerVehiculos(
        (response) => {
          setVehiculos(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    fetchVendores();
    fetchVehiculos();
  }, []);

  
  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);
    const formData = {};
    fd.forEach((value, key) => {
      formData[key] = value;
    });
    console.log('form data', formData);
    const listaVehiculos = Object.keys(formData)
      .map((k) => {
        if (k.includes('vehiculo')) {
          return vehiculosTabla.filter((v) => v._id === formData[k])[0];
        }
        return null;
      })
      .filter((v) => v);
  
    const datosVenta = {
      vendedor: vendedores.filter((v) => v._id === formData.vendedor)[0],
      cantidad: formData.valor,
      vehiculos: listaVehiculos,
    };

    

    await crearVenta(
      datosVenta,
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  
  useEffect(() => {
    //obtener lista de ventas desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);
  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Crear Venta');
      setColorBoton('indigo');
    } else {
      setTextoBoton('Mostrar Todas las ventas');
      setColorBoton('green');
    }
  }, [mostrarTabla]);

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <form ref={form} onSubmit={submitForm} className='flex flex-col h-full'>
        <h1 className='text-3xl font-extrabold text-gray-900 my-3'>Crear una nueva venta</h1>
        <label className='flex flex-col' htmlFor='vendedor'>
          <span className='text-2xl font-gray-900'>Vendedor</span>
          <select name='vendedor' className='p-2' defaultValue='' required>
            <option disabled value=''>
              Seleccione un Vendedor
            </option>
            {vendedores.map((el) => {
              return <option key={nanoid()} value={el._id}>{`${el.email}`}</option>;
            })}
          </select>
        </label>
        <TablaVehiculos
          vehiculos={vehiculos}
          setVehiculos={setVehiculos}
          setVehiculosTabla={setVehiculosTabla}
        />
        <label className='flex flex-col'>
          <span className='text-2xl font-gray-900'>Valor Total Venta</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            name='valor'
            required
          />
        </label>
        <button
          type='submit'
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Crear Venta
        </button>
      </form>
    </div>
  );
};
const TablaVehiculos = ({ vehiculos, setVehiculos, setVehiculosTabla }) => {
  const [vehiculoAAgregar, setVehiculoAAgregar] = useState({});
  const [filasTabla, setFilasTabla] = useState([]);

  useEffect(() => {
    setVehiculosTabla(filasTabla);
  }, [filasTabla, setVehiculosTabla]);
  

  const agregarNuevoVehiculo = () => {
    setFilasTabla([...filasTabla, vehiculoAAgregar]);
    setVehiculos(vehiculos.filter((v) => v._id !== vehiculoAAgregar._id));
    setVehiculoAAgregar({});
  };
  const eliminarVehiculo = (vehiculoAEliminar) => {
    setFilasTabla(filasTabla.filter((v) => v._id !== vehiculoAEliminar._id));
    setVehiculos([...vehiculos, vehiculoAEliminar]);
  };
  const modificarVehiculo = (vehiculo, cantidad) => {
    setFilasTabla(
      filasTabla.map((ft) => {
        if (ft._id === vehiculo.id) {
          ft.cantidad = cantidad;
          ft.total = vehiculo.price * cantidad;
        }
        return ft;
      })
    );
  };
  return (
    <div>
      <div className='flex '>
        <label className='flex flex-col' htmlFor='vehiculo'>
          <select
            className='p-2'
            value={vehiculoAAgregar._id ?? ''}
            onChange={(e) =>
              setVehiculoAAgregar(vehiculos.filter((v) => v._id === e.target.value)[0])
            }
          >
            <option disabled value=''>
              Seleccione un Vehiculo
            </option>
            {vehiculos.map((el) => {
              return (
                <option
                  key={nanoid()}
                  value={el._id}
                >{`${el.name} ${el.brand} ${el.model}`}</option>
              );
            })}
          </select>
        </label>
        <button
          type='button'
          onClick={() => agregarNuevoVehiculo()}
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Agregar Veh??culo
        </button>
      </div>
      <table className='tabla'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Cantidad</th>
            <th>Valor Unitario</th>
            <th>Total</th>
            <th>Eliminar</th>
            <th className='hidden'>Input</th>
          </tr>
        </thead>
        <tbody>
          {filasTabla.map((el, index) => {
            return (
              <FilaVehiculo
                key={el._id}
                veh={el}
                index={index}
                eliminarVehiculo={eliminarVehiculo}
                modificarVehiculo={modificarVehiculo}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
const FilaVehiculo = ({ veh, index, eliminarVehiculo, modificarVehiculo }) => {
  const [vehiculo, setVehiculo] = useState(veh);
  useEffect(() => {
    console.log('veh', vehiculo);
  }, [vehiculo]);
  return (
    <tr>
      <td>{vehiculo._id}</td>
      <td>{vehiculo.name}</td>
      <td>{vehiculo.brand}</td>
      <td>{vehiculo.model}</td>
      
      <td>
        <label htmlFor={`valor_${index}`}>
          <input
            type='number'
            name={`cantidad_${index}`}
            value={vehiculo.cantidad}
            onChange={(e) => {
              modificarVehiculo(vehiculo, e.target.value === '' ? '0' : e.target.value);
              setVehiculo({
                ...vehiculo,
                cantidad: e.target.value === '' ? '0' : e.target.value,
                total:
                  parseFloat(vehiculo.price) *
                  parseFloat(e.target.value === '' ? '0' : e.target.value),
              });
            }}
          />
        </label>
      </td>
      <td>{vehiculo.price}</td>
      <td>{parseFloat(vehiculo.total ?? 0)}</td>
      <td>
        <i
          onClick={() => eliminarVehiculo(vehiculo)}
          className='fas fa-minus text-red-500 cursor-pointer'
        />
      </td>
      <td className='hidden'>
        <input hidden defaultValue={vehiculo._id} name={`vehiculo_${index}`} />
      </td>
    </tr>
  );
};
export default Ventas;