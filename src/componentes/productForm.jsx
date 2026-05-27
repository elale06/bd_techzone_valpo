import React, { useState } from 'react';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  
  const [productos, setProductos] = useState([]);

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      setPreview(URL.createObjectURL(archivo));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !categoria || !imagen) {
      setError('Error: Todos los campos son obligatorios.');
      return;
    }

    if (Number(precio) <= 0) {
      setError('Error: El precio debe ser mayor a cero.');
      return;
    }

    setError('');

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio,
      categoria,
      preview
    };
    
    setProductos([...productos, nuevoProducto]);

    setNombre('');
    setPrecio('');
    setCategoria('');
    setImagen(null);
    setPreview(null);
  };

  return (
    <div className="form-container">
      <h2>Registrar Nuevo Producto</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label>Precio:</label>
          <input 
            type="number" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)} 
          />
        </div>

        <div>
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            <option value="Computación">Computación</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>

        <div>
          <label>Imagen del Producto:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>

        {preview && (
          <div>
            <p>Vista previa:</p>
            <img src={preview} alt="Vista previa" width="150" />
          </div>
        )}

        <button type="submit">Guardar Producto</button>
      </form>

      <hr />

      <h3>Productos Registrados</h3>
      <div className="productos-list">
        {productos.map((prod) => (
          <div key={prod.id} className="producto-card">
            <h4>{prod.nombre}</h4>
            <p>Categoría: {prod.categoria}</p>
            <p>Precio: ${prod.precio}</p>
            <img src={prod.preview} alt={prod.nombre} width="100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductForm;