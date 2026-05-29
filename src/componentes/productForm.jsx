import React, { useState } from 'react';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState(''); 
  const [stock, setStock] = useState(''); 
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const [productos, setProductos] = useState([]);

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const tamanoMaximo = 2 * 1024 * 1024; 
      if (archivo.size > tamanoMaximo) {
        setError('Error: La imagen supera el tamaño máximo permitido de 2MB.');
        setImagen(null);
        setPreview(null);
        return;
      }

      setError('');
      setImagen(archivo);
      setPreview(URL.createObjectURL(archivo));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !categoria || !descripcion.trim() || !stock || !imagen) {
      setError('Error: Todos los campos del formulario son estrictamente obligatorios.');
      return;
    }

    if (Number(precio) <= 0) {
      setError('Error: El precio debe ser un número mayor a cero.');
      return;
    }

    if (Number(stock) < 0) {
      setError('Error: El stock disponible no puede ser un valor negativo.');
      return;
    }

    setError('');

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio,
      categoria,
      descripcion,
      stock,
      preview
    };

    setProductos([...productos, nuevoProducto]);

    setNombre('');
    setPrecio('');
    setCategoria('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setPreview(null);
  };

  const handleEliminar = (id) => {
    const productosFiltrados = productos.filter(prod => prod.id !== id);
    setProductos(productosFiltrados);
  };

  return (
    <div className="form-container">
      <h2>TechZone Store - Registro de Productos</h2>
      
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Producto:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label>Precio ($):</label>
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
          <label>Descripción del Producto:</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          />
        </div>

        <div>
          <label>Stock Inicial:</label>
          <input 
            type="number" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
          />
        </div>

        <div>
          <label>Imagen (Máx. 2MB):</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>

        {preview && (
          <div className="preview-container">
            <p>Vista previa de selección:</p>
            <img src={preview} alt="Vista previa" width="120" />
          </div>
        )}

        <button type="submit">Guardar Producto</button>
      </form>

      <hr />

      <h3>Productos Registrados (Total: {productos.length})</h3>
      
      <div className="productos-list">
        {productos.map((prod) => (
          <div key={prod.id} className="producto-card">
            <span className="categoria-tag">{prod.categoria}</span>
            <h4>{prod.nombre}</h4>
            <p className="descripcion-text">{prod.descripcion}</p>
            <div className="card-meta">
              <p><strong>Precio:</strong> ${prod.precio}</p>
              <p><strong>Stock:</strong> {prod.stock} uds.</p>
            </div>
            <img src={prod.preview} alt={prod.nombre} />
            <button 
              onClick={() => handleEliminar(prod.id)} 
              className="btn-eliminar"
            >
              Eliminar Producto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductForm;