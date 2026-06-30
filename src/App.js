import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importar los componentes
import './App.css';
import ProductForm from './componentes/ProductForm';
import ClienteForm from './componentes/ClienteForm';
import PedidoForm from './componentes/PedidoForm';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Barra de Navegación */}
        <nav style={navStyle}>
          <h1 style={{ margin: 0 }}>TechZone Valpo</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/clientes" style={linkStyle}>Clientes</Link>
            <Link to="/productos" style={linkStyle}>Productos</Link>
            <Link to="/pedidos" style={linkStyle}>Pedidos</Link>
          </div>
        </nav>

        {/* Contenedor Principal donde cambian las pantallas */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<ProductForm />} /> {/* Ruta por defecto */}
            <Route path="/clientes" element={<ClienteForm />} />
            <Route path="/productos" element={<ProductForm />} />
            <Route path="/pedidos" element={<PedidoForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Estilos básicos en línea para la barra de navegación (puedes reemplazarlos con tu CSS luego)
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#333',
  color: 'white',
  padding: '15px 20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const linkStyle = {
  color: '#61dafb',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default App;