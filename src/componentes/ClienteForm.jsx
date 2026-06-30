import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClienteForm() {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [notificacion, setNotificacion] = useState('');

  // Cargar clientes desde MongoDB a través de tu API en Python
  const cargarClientes = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5000/api/clientes');
      setClientes(respuesta.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setError("No se pudo conectar con la base de datos.");
    }
  };

  // Se ejecuta al abrir la pestaña de Clientes
  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rut.trim() || !nombre.trim() || !correo.trim()) {
      setError('Error: Todos los campos son obligatorios.');
      return;
    }
    setError('');

    try {
      const payload = {
        rut: rut,
        nombre: nombre,
        correo: correo
      };

      // Enviar datos al Backend
      await axios.post('http://localhost:5000/api/clientes', payload);
      
      // Limpiar formulario y notificar
      setRut(''); setNombre(''); setCorreo('');
      setNotificacion('✅ Cliente guardado exitosamente en MongoDB');
      setTimeout(() => setNotificacion(''), 3000);
      
      // Actualizar la lista en pantalla
      cargarClientes(); 
      
    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Hubo un error al guardar el cliente.");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Clientes - TechZone</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>RUT del Cliente:</label>
          <input 
            type="text" 
            value={rut} 
            onChange={(e) => setRut(e.target.value)} 
            placeholder="Ej: 12345678-9" 
          />
        </div>
        <div>
          <label>Nombre Completo:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Ej: Juan Pérez" 
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            placeholder="Ej: juan.perez@correo.cl" 
          />
        </div>
        
        <button type="submit">Guardar Cliente</button>
      </form>

      <hr />
      
      <h3>Directorio de Clientes ({clientes.length})</h3>
      
      {clientes.length === 0 ? (
        <div className="empty-state">No hay clientes registrados aún.</div>
      ) : (
        <div className="productos-list">
          {clientes.map((cli) => (
            <div key={cli._id} className="producto-card" style={{ padding: '15px' }}>
              <h4>{cli.nombre}</h4>
              <p><strong>RUT:</strong> {cli.rut}</p>
              <p><strong>Correo:</strong> {cli.correo}</p>
            </div>
          ))}
        </div>
      )}

      {notificacion && (
        <div className="toast-notificacion">
          {notificacion}
        </div>
      )}
    </div>
  );
}

export default ClienteForm;